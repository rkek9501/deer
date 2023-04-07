import type { NextFunction, Request, Response } from "express";
import express from "express";
import https from "https";
import http from "http";
import next from "next";
import path from "path";

import { ACCESS_TOKEN_COOKIE_OPTIONS, HOST_URL, IS_LOCAL, SERVER_OPTIONS, IS_DEV, SERVER_PORT, STATIC_FILE_MAX_AGE } from "./env";
import applyMiddlewares from "./middleware";
import appRouter, { postRouter, tagRouter, userRouter } from "./routes";

let isAppGoingToBeClosed = false;

const run = (nextHandler: any) => {
  const server = express();
  applyMiddlewares(server);

  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
  server.use((req: Request, res: Response, next: NextFunction) => {
    if (isAppGoingToBeClosed) {
      res.set("Connection", "close");
    }
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({
        error: "Method Not Allowed",
        error_description: "허가되지 않은 메소드입니다."
      });
    }
    req.headers["x-forwarded-proto"] = "https";
    next();
  });

  server.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies["accessToken"] && req.session.accessToken) {
      res.cookie("accessToken", req.session.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    }
    if (req.cookies?.accessToken && req.session?.accessToken) {
      req.session.accessToken = req.cookies?.accessToken;
    }
    next();
  });
  server.use("/sitemap.xml", express.static(path.join(process.cwd(), "/public/sitemap.xml")));
  server.use("/robots.txt", express.static(path.join(process.cwd(), "/public/robots.txt")));
  server.use("/adx.txt", express.static(path.join(process.cwd(), "/public/ads.txt")));

  server.use(async (req: Request, res: Response, next: NextFunction) => {
    const reqUrls = req.url.split("/");
    const pathname = `/${reqUrls[1]}`;
    if (["/api", "/uploads", "/css", "/fonts", "/img"].includes(pathname)) {
      next();
    } else {
      nextHandler(req, res, next);
    }
  });

  server.use("/uploads", express.static(path.join(process.cwd(), "/uploads"), { maxAge: STATIC_FILE_MAX_AGE }));
  server.use("/img", express.static(path.join(process.cwd(), "/public/img"), { maxAge: STATIC_FILE_MAX_AGE }));
  // server.use("/favicon.ico", express.static(path.join(process.cwd(), "/public/img/favi/favicon.ico"), { maxAge: STATIC_FILE_MAX_AGE }));
  server.use("/css", express.static(path.join(process.cwd(), "/public/css")));
  server.use("/fonts", express.static(path.join(process.cwd(), "/public/fonts")));

  server.use("/api/user", userRouter);
  server.use("/api/post", postRouter);
  server.use("/api/tag", tagRouter);
  server.use(express.static(path.join(process.cwd(), "/public")));

  server.use("*", nextHandler);

  // const httpsServer = IS_LOCAL ? https.createServer(SERVER_OPTIONS, server) : http.createServer(server);
  const httpsServer = https.createServer(SERVER_OPTIONS, server);
  httpsServer.listen(SERVER_PORT, () => {
    console.log(`[Run Server] ${process.env.NODE_ENV}!`);
    console.log(`[Run Server] PORT:${SERVER_PORT}`);
    console.log(`[Run Server] URL:${HOST_URL}`);

    if (process.send) {
      process.send("ready");
      console.log(`[Run Server] Send to pm2 with ready message at ${new Date()}`);
    }
  });
  process.on("SIGINT", () => {
    isAppGoingToBeClosed = true;
    console.log("SIGINT signal received.");
    httpsServer.close(function (err) {
      if (err) {
        console.error("SIGINT err", err);
      }
      process.exit(err ? 1 : 0);
    });
  });
};

const isPreServer = process.env.IS_PRE === "true";

const getApp = () =>
  next({
    dev: IS_DEV,
    customServer: true,
    port: Number(SERVER_PORT),
    dir: process.cwd()
  });

if (isPreServer) {
  console.log("[Run Server] Pre-Server");
  const app = getApp();

  const nextHandler = appRouter.getRequestHandler(app);

  run(nextHandler);
} else {
  console.log("[Run Server] Rel-Server");
  const app = getApp();
  app
    .prepare()
    .then(() => {
      const nextHandler = appRouter.getRequestHandler(app);
      run(nextHandler);
    })
    .catch((err) => {
      console.log("[Run Server Error] Next App server Error!", err);
    });
}
