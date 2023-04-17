/// <reference path="./../@types/express.d.ts" />

import express from "express";
import fs from "fs";
import path from "path";
import { Op, Sequelize } from "sequelize";
import type { Transaction } from "sequelize/types";
import { parse as parseHtml } from "node-html-parser";

import clone from "lodash/clone";
import flatten from "lodash/flatten";
import difference from "lodash/difference";
import isEqual from "lodash/isEqual";
import uniq from "lodash/uniq";
import uniqWith from "lodash/uniqWith";

import models from "../models";
import { accessCheck, authCheck } from "../utils/auth";
import { base64, utf8 } from "../utils/crypt";
import { sortDesc } from "../utils/func";
import generateSiteMap from "../utils/sitemapGenerator";
import upload from "../utils/upload";
import { isValidHex } from "../utils/vaild";

const { posts, tags, post_tag, files, users } = models;
const appRouter = express.Router();

const getSubPathOfPost = (id: number, writterId: string, title: string) => {
  return base64.encode(utf8.encode(JSON.stringify({ id, writterId, title })));
};

const findPaths = async () => {
  const list = await posts
    .findAll({
      where: { deletedAt: null },
      order: [["createdAt", "ASC"]],
      attributes: { exclude: ["content", "subtitle", "viewCount", "createdAt", "deletedAt"] }
    })
    .then((data: any) => JSON.parse(JSON.stringify(data)));
  const pathMapping = list.map((item: any) => {
    return {
      ...item,
      subpath: base64.encode(utf8.encode(JSON.stringify({ id: item.id, writterId: item.writterId, title: item.title })))
    };
  });
  return pathMapping;
};

appRouter.get("/item/:content", authCheck, async (req, res) => {
  const { content } = req.params;

  try {
    const decode = JSON.parse(utf8.decode(base64.decode(content?.toString() ?? "")));
    const item = await posts
      .findOne({
        where: {
          id: decode.id,
          writterId: decode.writterId,
          deletedAt: null
        },
        attributes: { exclude: ["deletedAt"] },
        include: [
          { model: tags, through: { attributes: ["postId", "tagId"] } },
          {
            model: files,
            attributes: [
              ["origin_name", "name"],
              ["s3Path", "src"]
            ]
          },
          { model: users, attributes: ["id", "name", "email", "image"] }
        ]
      })
      .then(async (post: any) => {
        if (post) {
          // if (post.dataValues.writterId !== userId && post.dataValues.openState === "N") return null;
          return await post.update({
            viewCount: post.dataValues.viewCount + 1
          });
        } else return null;
      });
    if (item) return res.status(200).send({ result: true, data: item, message: "게시글이 조회되었습니다." });
    else return res.status(200).send({ result: false, data: null, message: "열람 불가능한 게시글 입니다." });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "게시글 조회중 오류가 발생하였습니다." });
  }
});

appRouter.get("/paths", authCheck, async (req, res) => {
  try {
    const list = await posts
      .findAll({
        where: { deletedAt: null },
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["content", "subtitle", "viewCount", "createdAt", "updatedAt", "deletedAt"] }
      })
      .then((data: any) => JSON.parse(JSON.stringify(data)));
    const pathMapping = list.map((item: any) => {
      return {
        ...item,
        subpath: base64.encode(
          utf8.encode(JSON.stringify({ id: item.id, writterId: item.writterId, title: item.title }))
        )
      };
    });
    return res.status(200).send({ result: true, data: pathMapping, message: "게시글 목록이 조회되었습니다." });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "게시글 조회중 오류가 발생하였습니다." });
  }
});

appRouter.get("/list", authCheck, async (req, res) => {
  try {
    const userId = req.auth?.id;
    const user = userId ? await users.findOne({ where: { id: userId }, raw: true }) : null;

    const list = await posts
      .findAll({
        where: { deletedAt: null },
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["content", "deletedAt"] },
        include: [
          { model: tags, through: { attributes: ["postId", "tagId"] } },
          {
            model: files,
            attributes: [
              ["origin_name", "name"],
              ["s3Path", "src"]
            ]
          },
          { model: users, attributes: ["id", "name", "email", "image"] }
        ]
      })
      .then((data: any) => JSON.parse(JSON.stringify(data)));
    const filtering = list.filter(
      (item: any) => item.openState === "Y" || item.writterId === user?.id || req.auth?.verified
    );
    const pathMapping = filtering.map((item: any) => {
      return {
        ...item,
        subpath: getSubPathOfPost(item.id, item.writterId, item.title)
      };
    });
    return res.status(200).send({ result: true, data: pathMapping, message: "게시글 목록이 조회되었습니다." });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "게시글 조회중 오류가 발생하였습니다." });
  }
});

// appRouter.get("/test", async (req, res) => {
//   if(!req.session?.testNum && typeof req.session.testNum === "undefined") {
//     req.session.testNum = 0;
//   } else {
//     req.session.testNum += 1;
//   }
//   req.session.save();
//   res.send({ testNum: req.session.testNum });
// });

appRouter.get("/recommend/:content", authCheck, async (req, res) => {
  const { content } = req.params;

  try {
    const decode = JSON.parse(utf8.decode(base64.decode(content?.toString() ?? "")));
    const userId = req.auth?.id;
    const user = userId ? await users.findOne({ where: { id: userId }, raw: true }) : null;

    const tagList = await posts
      .findOne({
        where: {
          id: decode.id,
          writterId: decode.writterId,
          deletedAt: null
        },
        attributes: { exclude: ["deletedAt"] },
        include: [
          {
            model: tags,
            through: { attributes: ["postId", "tagId"] },
            attributes: ["id", "color", "name"]
          }
        ],
        order: [["id", "ASC"]]
      })
      .then((data: any) => JSON.parse(JSON.stringify(data)))
      .then((item: any) => item?.tags?.map((tag: any) => ({ id: tag.id, color: tag.color, name: tag.name })));

    const list = await posts
      .findAll({
        where: { id: { [Op.not]: decode.id }, openState: "Y", deletedAt: null },
        // where: { openState: "Y", deletedAt: null, id: { [Op.not]: decode.id } },
        attributes: {
          exclude: ["content", "deletedAt"]
        },
        include: [
          {
            model: tags,
            required: true,
            // where: { [Op.or]: tagList },
            attributes: ["id", "color", "name"],
            through: { attributes: ["postId", "tagId"] }
          },
          {
            model: files,
            attributes: ["order", ["origin_name", "name"], ["s3Path", "src"]],
            order: [["order", "ASC"]],
            limit: 1
          }
        ],
        order: [
          ["id", "DESC"],
          [Sequelize.literal("tags.id"), "ASC"]
        ]
      })
      .then((data: any) => JSON.parse(JSON.stringify(data)))
      .then((items: any) =>
        items
          .map((data: any) => {
            let overlapCount = 0;
            for (const _tag of tagList) {
              if (data.tags?.find((t: any) => t.id === _tag.id)) overlapCount++;
            }
            const datas = data;
            datas.overlapCount = overlapCount;
            datas.subpath = getSubPathOfPost(data.id, data.writterId, data.title);
            return datas;
          })
          .sort((a: any, b: any) => sortDesc(a, b, "viewCount"))
          .sort((a: any, b: any) => sortDesc(a, b, "overlapCount"))
      );

    // console.log(JSON.stringify({ list, posts, decode }, null, 2));
    return res.status(200).send({ result: true, data: list, message: "게시글 목록이 조회되었습니다." });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "게시글 조회중 오류가 발생하였습니다." });
  }
});
const isRegValid = (text: string) => {
  if (text.length === 0) return false;
  const headReg = /^\#.\s*/;
  const blockQuoteReg = /^\>.\s*/;
  const orLiReg = /^[0-9]{1,3}.\s.*/;

  const isHead = headReg.test(text);
  const isList = orLiReg.test(text);
  const isQuote = blockQuoteReg.test(text);

  const isBoldOrItalic = text.indexOf("*") === 0;
  const isLink = text.indexOf("!") === 0 || text.indexOf("[") === 0;
  const isCode = text.indexOf("```") === 0;
  const isImg = text.indexOf("<img") > -1;
  const isEmptyStr = text.trim().length === 0;

  return isHead || (!isList && !isQuote && !isBoldOrItalic && !isLink && !isCode && !isImg && !isEmptyStr);
};

const getSubtitleFromMarkdown = (markdown: string) => {
  const lines = markdown.split("\n");
  let subtitle: null | string = "";

  for (let line of lines) {
    if (!subtitle && isRegValid(line)) {
      if (line.indexOf("# ") !== -1) {
        subtitle = parseHtml(line).innerText.split("# ")[1];
      } else {
        subtitle = parseHtml(line).innerText;
      }
    }
    if (subtitle) break;
  }
  if (!subtitle) {
    subtitle = "";
  }
  return subtitle;
};

appRouter.post("/create", accessCheck, async (req, res) => {
  const { title, content, openState, tagList } = req.body;
  const userId = req.auth?.id;
  const verified = req.auth?.verified;
  try {
    const user = await users.findOne({ where: { id: userId }, raw: true });
    if (!userId || !verified || !user)
      return res.status(200).send({ result: false, message: "you cannot upload posts." });

    if (!title || title.trim().length === 0)
      return res.status(200).send({ result: false, message: "제목을 입력해주세요." });
    else if (!content || content.trim().length === 0)
      return res.status(200).send({ result: false, message: "내용을 입력해주세요." });
    else if (!["N", "Y"].includes(openState))
      return res.status(200).send({ result: false, message: "입력값이 잘못되었습니다." });

    const subtitle = getSubtitleFromMarkdown(content);
    const _files = parseHtml(content).querySelectorAll("img");
    const uploadFiles: { name: string; src: string }[] = [];
    for (const _file of _files) {
      const src = _file.getAttribute("src");
      if (typeof src !== "undefined") {
        uploadFiles.push({
          name: src.replace("/uploads/", ""),
          src
        });
      }
    }

    let selectedTags: any = null;
    if (tagList && tagList.length > 0) {
      selectedTags = await tags
        .findAll({
          where: { [Op.or]: tagList }
        })
        .then((data: any) => JSON.parse(JSON.stringify(data)));
    }

    const item = await posts.findOne({
      where: {
        title,
        deletedAt: null
      },
      attributes: { exclude: ["deletedAt"] }
    });
    if (item) return res.status(200).send({ result: false, message: "이미 존재하는 게시글 입니다." });

    await models.sequelize.transaction(async (transaction: Transaction) => {
      const post = await posts.create(
        {
          title,
          subtitle,
          content,
          viewCount: 0,
          writterId: user.id,
          openState
        },
        { transaction }
      );
      if (!post) return res.status(200).send({ result: false, message: "게시글 작성에 실패하였습니다." });

      if (uploadFiles && uploadFiles.length > 0) {
        const postImageList = uploadFiles.map((img: any, idx: number) => ({
          post_id: post.id,
          order: idx + 1,
          origin_name: img.name,
          s3Path: img.src
        }));
        await files.bulkCreate(postImageList, { transaction });
      }

      const newTags = tagList.filter((tag: any) => !tag.id).map((tag: any) => ({ name: tag.name, color: tag.color }));
      if (newTags.length > 0) {
        const postTagList = selectedTags.map((tag: any) => ({ postId: post.id, tagId: tag.id }));

        let combin = [].concat(postTagList);
        if (newTags && newTags.length > 0) {
          const createTags = await tags.bulkCreate(newTags, { transaction });
          const createdTags = createTags.map((tag: any) => ({ postId: post.id, tagId: tag.dataValues.id }));
          combin = [].concat(postTagList, createdTags);
        }

        await post_tag.bulkCreate(combin, { transaction });
      }

      new Promise(async () => {
        const paths = await findPaths();
        generateSiteMap(paths);
      });

      return res.status(200).send({ result: true, message: "게시글이 작성되었습니다." });
    });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "게시글 작성중 오류가 발생하였습니다." });
  }
});

appRouter.put("/update", accessCheck, async (req, res) => {
  const { id, title, content, openState, tagList } = req.body;
  const userId = req.auth?.id;
  const verified = req.auth?.verified;
  // console.log({ userId, verified }, req.body);
  try {
    const user = await users.findOne({ where: { id: userId }, raw: true });
    if (!userId || !verified || !user)
      return res.status(200).send({ result: false, message: "you cannot upload posts." });

    if (!title || title.trim().length === 0)
      return res.status(200).send({ result: false, message: "제목을 입력해주세요." });
    else if (!content || content.trim().length === 0)
      return res.status(200).send({ result: false, message: "내용을 입력해주세요." });
    else if (!["N", "Y"].includes(openState))
      return res.status(200).send({ result: false, message: "입력값이 잘못되었습니다." });

    const subtitle = getSubtitleFromMarkdown(content);

    await models.sequelize.transaction(async (transaction: Transaction) => {
      // 게시글 조회
      const post = await posts
        .findOne({
          where: {
            id: id,
            // writterId: userId,
            deletedAt: null
          },
          attributes: { exclude: ["deletedAt"] },
          include: [
            {
              model: tags,
              through: { attributes: ["postId", "tagId"] },
              attributes: ["id", "name", "color"],
              required: false
            },
            {
              model: files,
              attributes: ["post_id", "order", ["origin_name", "name"], ["s3Path", "src"]],
              required: false
            }
          ]
        })
        .then((data: any) => JSON.parse(JSON.stringify(data)));
      // console.log({ post });
      // 태그 업데이트
      const postedTags = post?.tags?.map((tag: any) => tag.id).sort();
      const selectedTags = tagList
        .filter((tag: any) => tag.id)
        .map((tag: any) => tag.id)
        .sort();
      const total = [].concat(postedTags, selectedTags);
      const uniqTotal = uniqWith(clone(total), isEqual);
      const willAddTags = difference(clone(uniqTotal), postedTags);
      const willDelTags = difference(clone(uniqTotal), selectedTags);
      const newTags = tagList.filter((tag: any) => !tag.id).map((tag: any) => ({ name: tag.name, color: tag.color }));
      // console.log({ selectedTags, postedTags, uniqTotal });
      // console.log({ willAddTags, willDelTags });
      // console.log({ newTags });
      if (
        post.title === title &&
        post.content === content &&
        post.openState === openState &&
        JSON.stringify(postedTags) === JSON.stringify(selectedTags) &&
        newTags.length === 0
      ) {
        console.log("수정되지 않음");
        return res.status(200).send({ result: false, message: "수정된 내용이 없습니다." });
      }
      type TypeofTag = {
        postId: number;
        tagId: number;
      };
      if (post.writterId === userId) {
        if (willAddTags.length > 0 || newTags.length > 0) {
          // 새로 선택된 태그 추가
          const postTagList: TypeofTag[] = willAddTags.map((tagId) => ({ postId: post.id, tagId: tagId }));
          await post_tag.bulkCreate(postTagList, { transaction });

          // 새로 생성된 태그 생성 후 추가
          if (newTags && newTags.length > 0) {
            const createTags = await tags.bulkCreate(newTags, { transaction });
            const createdTags = createTags.map((tag: any) => ({ postId: post.id, tagId: tag.dataValues.id }));

            await post_tag.bulkCreate(createdTags, { transaction });
          }
        }

        // 선택 해제된 태그 제거
        if (willDelTags.length > 0) {
          await post_tag.destroy({
            where: { postId: post.id, tagId: { [Op.or]: willDelTags } },
            transaction
          });
        }

        // 파일 컨텐츠 업데이트
        const _files = parseHtml(content).querySelectorAll("img");
        const uploadFiles: any[] = [];
        for (const [_idx, _file] of _files.entries()) {
          const src = _file.getAttribute("src");
          uploadFiles.push({
            post_id: post.id,
            order: _idx + 1,
            name: src ? src.replace("/uploads/", "") : null,
            src
          });
        }

        // console.log({ files: post.files, uploadFiles });
        const orginFileCnt = post.files.length;
        const newFileCnt = uploadFiles.length;
        const willCreateFiles: any[] = [];
        const willUpdateFiles: any[] = [];
        const willDeleteFiles: any[] = [];
        if (orginFileCnt > newFileCnt) {
          for (const [_i, _f] of post.files.entries()) {
            if (uploadFiles[_i]) {
              willUpdateFiles.push(uploadFiles[_i]);
            } else {
              willDeleteFiles.push(_f);
            }
          }
        } else if (orginFileCnt < newFileCnt) {
          for (const [_i, _f] of uploadFiles.entries()) {
            if (post.files[_i]) {
              willUpdateFiles.push(_f);
            } else {
              willCreateFiles.push(_f);
            }
          }
        } else {
          willUpdateFiles.concat(uploadFiles);
        }

        // console.log({ willUpdateFiles, willCreateFiles, willDeleteFiles });

        if (willUpdateFiles.length > 0) {
          for (const _wuf of willUpdateFiles) {
            await files.update(
              { origin_name: _wuf.name, s3Path: _wuf.src },
              { where: { post_id: post.id, order: _wuf.order }, transaction }
            );
          }
        }
        if (willCreateFiles.length > 0) {
          const mappedList = willCreateFiles.map((file: any) => ({
            post_id: post.id,
            order: file.order,
            origin_name: file.name,
            s3Path: file.src
          }));
          await files.bulkCreate(mappedList, { transaction });
        }
        if (willDeleteFiles.length > 0) {
          for (const _wdf of willDeleteFiles) {
            await files.destroy({
              where: { post_id: post.id, order: _wdf.order },
              transaction
            });
          }
        }

        const updated = await posts.update(
          {
            title,
            subtitle,
            content,
            writterId: user.id,
            openState
          },
          { where: { id: post.id }, transaction }
        );

        if (updated && openState === "Y") {
          new Promise(async () => {
            const paths = await findPaths();
            generateSiteMap(paths);
          });
        }

        if (updated) return res.status(200).send({ result: true, message: "게시글이 수정되었습니다." });
      }
      return res.status(200).send({ result: false, message: "게시글 수정에 실패하였습니다." });
    });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "게시글 수정중 오류가 발생하였습니다." });
  }
});

appRouter.delete("/delete", accessCheck, async (req, res) => {
  const { id } = req.query;
  const userId = req.auth?.id;
  const verified = req.auth?.verified;
  try {
    const user = await users.findOne({ where: { id: userId }, raw: true });
    if (!id || !verified || !user) return res.status(200).send({ result: false, message: "you cannot upload posts." });

    await models.sequelize.transaction(async (transaction: Transaction) => {
      const post = await posts.findOne({ where: { id } }).then(async (post: any) => {
        if (post.dataValues.writterId === user.id) return await posts.destroy({ where: { id } }, { transaction });
        else return null;
      });

      // TODO: post_tag - 태그 조회 후 삭제
      if (post) return res.status(200).send({ result: true, message: "게시글이 삭제되었습니다." });
      else return res.status(200).send({ result: false, message: "게시글 삭제에 실패하였습니다." });
    });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "게시글 삭제중 오류가 발생하였습니다." });
  }
});

// 파일 업로드 api
appRouter.post("/upload", accessCheck, async (req, res) => {
  // 파일업로드 폴더 존재하지 않을 경우 폴더 생성
  const uploadPath = path.join(process.cwd(), "./uploads");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  // 파일 업로드
  upload(req, res, function (err: any) {
    if (err) {
      return res.status(500).send(false);
    }

    if (req.file) {
      console.log("원본파일명 : " + req.file.originalname);
      console.log("저장파일명 : " + req.file.filename);
      console.log("크기 : " + req.file.size);

      return res.status(200).send({ result: true, file: req.file.filename });
    } else {
      return res.status(200).send({ result: false, file: null });
    }
  });
});

appRouter.delete("/checkFiles", async (req, res) => {
  try {
    const dbFileList = await files
      .findAll({ attributes: ["post_id", "origin_name", "s3Path"] })
      .then((data: any) => JSON.parse(JSON.stringify(data)));
    const uploadPath = path.join(process.cwd(), "./uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    const dbFiles = dbFileList.map((elem: any) => elem.origin_name);

    fs.readdir(uploadPath, { withFileTypes: true }, function (error, items) {
      if (error) {
        /* 에러 처리 */
        res.send({ error, fileList: [], folderList: [] });
        return;
      }

      let files: string[] = [];
      let folders: string[] = [];
      // console.log({ items });

      const willDelFiles: string[] = [];
      for (let item of items) {
        /* 폴더인 경우 folders에 추가 */
        if (item.isDirectory()) folders.push(item.name);
        else {
          files.push(item.name);
          if (!dbFiles.includes(item.name)) {
            willDelFiles.push(item.name);
            fs.unlink(path.join(process.cwd(), "./uploads/" + item.name), (err) => {
              if (err) console.log("fs unlink err", err);
            });
          }
        }
      }
    });

    return res.status(200).send(true);
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send(false);
  }
});

export default appRouter;
