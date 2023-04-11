/// <reference path="./../@types/express.d.ts" />

import express from "express";
import { Op, Sequelize } from "sequelize";
import type { Transaction } from "sequelize/types";

import flatten from "lodash/flatten";
import uniq from "lodash/uniq";

import { accessCheck, authCheck } from "../utils/auth";
import models from "../models";
import { isValidHex } from "../utils/vaild";

const { posts, tags } = models;
const appRouter = express.Router();

appRouter.get("/", async (req, res) => {
  try {
    const { option } = req.query;

    if (option === "all") {
      const tagList = await tags.findAll();
      return res.status(200).send({ result: true, data: tagList });
    }
    const list = await posts
      .findAll({
        where: { deletedAt: null, openState: "Y" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["content", "subtitle", "writterId", "viewCount", "createdAt", "updatedAt", "deletedAt"]
        },
        include: [{ model: tags, through: { attributes: ["postId", "tagId"] } }]
      })
      .then((data: any) => JSON.parse(JSON.stringify(data)));

    const tagsIds = list.map((_: any, i: number) => {
      return _.tags?.map((__: any) => __.id) || [];
    });

    const tagIds = flatten(tagsIds);
    const uniqTagIds = uniq(tagIds);
    const tagList = await tags.findAll({ where: { id: uniqTagIds } });

    return res.status(200).send({ result: true, data: tagList });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "태그 조회중 오류가 발생하였습니다." });
  }
});

appRouter.post("/", accessCheck, async (req, res) => {
  const { color, name } = req.body;
  console.log({ color, name });
  try {
    if (!isValidHex(color)) return res.status(200).send({ result: false, message: "color 값이 올바르지 않습니다." });
    const result = await models.sequelize.transaction(async (t: Transaction) => {
      const tag = await tags.findOne({ where: { name } }, { transaction: t });
      if (tag) return null;
      return await tags.create({ name, color }, { transaction: t });
    });
    return res
      .status(200)
      .send({
        result: result ? true : false,
        message: result ? "태그가 생성되었습니다." : "이미 존재하는 태그입니다."
      });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "태그 생성중 오류가 발생하였습니다." });
  }
});

appRouter.put("/", accessCheck, async (req, res) => {
  const { id, color, name } = req.body;
  try {
    if (!isValidHex(color)) return res.status(200).send({ result: false, message: "color 값이 올바르지 않습니다." });

    const find = await tags.findOne({ where: { name, id: { [Op.not]: id } } });
    if (find) return res.status(200).send({ result: false, message: "이미 존재하는 태그이름 입니다." });

    const result = await models.sequelize.transaction(async (t: Transaction) => {
      return await tags.findOne({ where: { id } }, { transaction: t }).then(async (tag: any) => {
        if (tag) return await tag.update({ name, color }, { transaction: t });
        return null;
      });
    });

    return res
      .status(200)
      .send({
        result: result ? true : false,
        message: result ? "태그가 수정되었습니다." : "존재하지 않는 태그입니다."
      });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "태그 수정중 오류가 발생하였습니다." });
  }
});

appRouter.delete("/", accessCheck, async (req, res) => {
  const { id } = req.query;
  try {
    const result = await models.sequelize.transaction(async (t: Transaction) => {
      return await tags.findOne({ where: { id } }, { transaction: t }).then(async (tag: any) => {
        if (tag) return await tags.destroy({ where: { id } }, { transaction: t });
        else return null;
      });
    });

    return res
      .status(200)
      .send({
        result: result ? true : false,
        message: result ? "태그가 삭제되었습니다." : "존재하지 않는 태그입니다."
      });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "태그 삭제중 오류가 발생하였습니다." });
  }
});

export default appRouter;
