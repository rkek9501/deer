/// <reference path="./../@types/express.d.ts" />

import express from "express";
import fs from "fs";
import moment from "moment";
import path from "path";
import type { Transaction } from "sequelize/types";
import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from "../env";
import models from "../models";
import { accessCheck, authCheck } from "../utils/auth";
import { base64, compare, hash } from "../utils/crypt";
import { setAccessToken, setRefreshToken } from "../utils/jwt";
import upload from "../utils/upload";
import { passwordValidation } from "../utils/vaild";

const appRouter = express.Router();

// 유저 추가
appRouter.post("/create", accessCheck, async (req, res) => {
  const { id, pw, name, email } = req.body;
  try {
    if (!id || id === "") {
      return res.status(200).send({ result: false, message: "아이디를 입력해주세요." });
    } else if (!pw || pw === "") {
      return res.status(200).send({ result: false, message: "비밀번호를 입력해주세요." });
    } else if (!name || name === "") {
      return res.status(200).send({ result: false, message: "이름을 입력해주세요." });
    }

    const valid = passwordValidation(pw);
    if (valid) {
      return res.status(200).send({ result: false, message: valid });
    }

    const hashedPw = await hash(pw);
    await models.users.create({
      id,
      name,
      email: email || null,
      password: hashedPw
    });
    return res.status(200).send({ result: true, message: "유저가 생성되었습니다." });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "유저 생성에 실패하였습니다." });
  }
});

// 비말번호 변경
appRouter.put("/changePassword", accessCheck, async (req, res) => {
  const id = req.auth?.id;
  const verified = req.auth?.verified;
  const { prevPw, nextPw } = req.body;

  try {
    if (!id || id === "") {
      return res.status(200).send({ result: false, message: "아이디를 입력해주세요." });
    } else if (!prevPw || prevPw === "") {
      return res.status(200).send({ result: false, message: "이전 비밀번호를 입력해주세요." });
    } else if (!nextPw || nextPw === "") {
      return res.status(200).send({ result: false, message: "변경할 비밀번호를 입력해주세요." });
    } else if (prevPw === nextPw) {
      return res.status(200).send({
        result: false,
        message: "이전 비밀번호와 변경할 비말번호가 동일합니다."
      });
    }

    const prevPwDec = base64.decode(prevPw);
    const nextPwDec = base64.decode(nextPw);

    const valid = passwordValidation(nextPwDec);
    if (valid) {
      return res.status(200).send({ result: false, message: valid });
    }

    const hashedPw = await hash(nextPwDec);

    await models.sequelize.transaction(async (transaction: Transaction) => {
      const user = await models.users.findOne({ where: { id } });
      const currPwVaild = await compare(prevPwDec, user.dataValues.password);

      if (!user) {
        return res.status(200).send({ result: false, message: "존재하지 않는 아이디 입니다." });
      } else if (!currPwVaild) {
        return res.status(200).send({ result: false, message: "현재 비밀번호가 일치하지 않습니다." });
      }

      await user.update(
        {
          password: hashedPw,
          loginFailCount: 0
        },
        {
          where: { id },
          transaction
        }
      );
      return res.status(200).send({ result: true, message: "비밀번호가 변경되었습니다." });
    });
  } catch (exception) {
    console.log("error", exception);
    res.status(500).send({ result: false, message: "비밀번호 변경에 실패하였습니다." });
  }
});

// 로그인
appRouter.post("/login", async (req, res) => {
  const { id, pw } = req.body;
  try {
    if (!id || id === "") {
      return res.status(200).send({ result: false, message: "아이디를 입력해주세요." });
    } else if (!pw || pw === "") {
      return res.status(200).send({ result: false, message: "비밀번호를 입력해주세요." });
    }

    const user = await models.users.findOne({
      where: { id },
      attributes: ["id", "name", "password", "loginFailCount", "updatedAt", "token"]
    });
    if (!user) {
      return res.status(500).send({ result: false, message: "존재하지 않은 사용자입니다." });
    }

    const { id: userId, password: userPw, name, loginFailCount, updatedAt } = user.dataValues;

    // 최근 접속시도 일시 확인
    const diffMimutes = moment().diff(updatedAt, "minutes");
    if (loginFailCount >= 5 && diffMimutes < 30) {
      return res.status(500).send({
        result: false,
        message: "로그인에 5회 실패하였습니다. 30분후 다시 시도해 주세요."
      });
    }

    // 비밀번호 비교
    const vaildPw = await compare(pw, userPw);
    if (!vaildPw) {
      // 비밀번호 실패 카운트 +1
      await models.users.update(
        {
          loginFailCount: loginFailCount + 1
        },
        {
          where: { id }
        }
      );
      return res.status(500).send({ result: false, message: "비밀번호가 일치하지 않습니다." });
    }

    const accessToken = setAccessToken(id);
    const refreshToken = setRefreshToken(id);

    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;
    req.session.save((err: any) => console.log("save Error", err));

    res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    // res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    // 로그인 성공 비밀번호 실패 카운트 초기화
    const refreshData: { loginFailCount: number; loginAt: any; token?: string } = {
      loginFailCount: 0,
      loginAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      token: accessToken
    };
    await models.users.update(refreshData, {
      where: { id }
    });

    return res.status(200).send({ result: true, message: "로그인 완료", token: accessToken, name });
  } catch (exception) {
    console.log("error", exception);
    return res.status(500).send({ result: false, message: "로그인에 실패하였습니다." });
  }
});


// appRouter.get('/test', authCheck, (req, res) => {  // 3
//   console.log(req.session);
//   const accessToken = setAccessToken("test");
//   req.session.accessToken = accessToken;
//   // req.session.refreshToken = refreshData.token || user.token;
//   if(!req.session.testNum){
//     req.session.testNum = 1;
//   } else {
//     req.session.testNum = req.session.testNum + 1;
//     req.session.save((err: any) => console.log("save Error", err));
//   }
//   res.send(`Number : ${req.session.testNum}`);
// });

// 로그아웃
appRouter.get("/logout", authCheck, async (req, res) => {
  const userId = req.auth?.id;
  await models.users.update(
    { token: null },
    {
      where: { id: userId }
    }
  );
  req.auth = undefined;
  req.session.destroy();
  return res.status(200).send({ result: true, message: "로그아웃 되었습니다." });
});

appRouter.get("/checkSession", authCheck, async (req, res) => {
  try {
    if (!req.auth) {
      throw Error("unauthorized");
    }
    return res.status(200).send({ result: true });
  } catch (e) {
    return res.status(200).send({ result: false });
  }
});

appRouter.get("/profile", accessCheck, async (req, res) => {
  const id = req.auth?.id;

  try {
    const user = await models.users
      .findOne({
        where: { id },
        attributes: ["id", "name", "email", "image"]
      })
      .then((data: any) => JSON.parse(JSON.stringify(data)));
    return res.status(200).send({ user });
  } catch (e) {
    return res.status(401).send(false);
  }
});

appRouter.put("/changeProfile", accessCheck, async (req, res) => {
  const id = req.auth?.id;
  const { name, email } = req.body;

  try {
    const params: { name?: string; email?: string } = {};
    if (name && name.trim().length !== 0) {
      params.name = name;
    }
    if (email && email.trim().length !== 0) {
      params.email = email;
    }

    await models.sequelize.transaction(async (transaction: Transaction) => {
      const user = await models.users.findOne({ where: { id } });

      await user.update(params, { where: { id }, transaction });
      return res.status(200).send({ result: true });
    });
  } catch (e) {
    return res.status(401).send(false);
  }
});

appRouter.post("/upload", accessCheck, async (req, res) => {
  const id = req.auth?.id;

  // 파일업로드 폴더 존재하지 않을 경우 폴더 생성
  const uploadPath = path.join(process.cwd(), "./uploads/user");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  // 파일 업로드
  new Promise((resolve, reject) =>
    upload(req, res, async (err: any) => {
      if (err) reject();

      if (req.file) {
        console.log("원본파일명 : " + req.file.originalname);
        console.log("저장파일명 : " + req.file.filename);
        console.log("크기 : " + req.file.size);
        resolve(req.file.filename);
      } else {
        reject();
      }
    })
  )
    .then(async (filename) => {
      const user = await models.users.findOne({ where: { id }, attributes: ["id", "image"] });
      const { image } = user.dataValues;

      await models.users.update({ image: `/uploads/user/${filename}` }, { where: { id } });

      // 이전 이미지 삭제
      if (image && image.length > 0) {
        fs.unlink(path.join(process.cwd(), image), (err) => {
          if (err) console.log("fs unlink err", err);
        });
      }
      return res.status(200).send({ result: true, file: filename });
    })
    .catch((e) => {
      return res.status(500).send(false);
    });
});

export default appRouter;
