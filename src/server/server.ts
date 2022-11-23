import type { NextFunction, Request, Response } from "express";
import express from "express";
import fs from "fs";
import https from "https";
import http from "http";
import next from "next";
import path from "path";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  HOST_URL,
  IS_LOCAL,
  SERVER_URL,
  IS_DEV,
  SERVER_PORT,
  STATIC_FILE_MAX_AGE
} from "./env";
import applyMiddlewares from "./middleware";
import appRouter, { postRouter, userRouter } from "./routes";

const app = next({
  dev: IS_DEV,
  customServer: true,
  port: Number(SERVER_PORT),
  dir: process.cwd()
});

// const key = fs.readFileSync(`/etc/letsencrypt/live/${SERVER_URL}/privkey.pem`);
// const cert = fs.readFileSync(`/etc/letsencrypt/live/${SERVER_URL}/cert.pem`);
// const ca = fs.readFileSync(`/etc/letsencrypt/live/${SERVER_URL}/fullchain.pem`);
const options = IS_DEV ? {
  // key,
  // cert,
  // ca
} : {
};

const nextHandler = appRouter.getRequestHandler(app);

const run = () => {
  const server = express();
  applyMiddlewares(server);

  // let isAppGoingToBeClosed = false;
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
  server.use((req: Request, res: Response, next: NextFunction) => {
    // if (isAppGoingToBeClosed) {
    //   res.set("Connection", "close");
    // }
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({
        error: "Method Not Allowed",
        error_description: "허가되지 않은 메소드입니다."
      });
    }
    req.headers["x-forwarded-proto"] = "https";
    next();
  });

  server.use("/uploads", express.static(path.join(process.cwd(), "/uploads"), { maxAge: STATIC_FILE_MAX_AGE }));
  server.use("/img", express.static(path.join(process.cwd(), "/public/img"), { maxAge: STATIC_FILE_MAX_AGE }));
  server.use("/favicon.ico", express.static(path.join(process.cwd(), "/public/img/favi/favicon.ico"), { maxAge: STATIC_FILE_MAX_AGE }));
  server.use("/css", express.static(path.join(process.cwd(), "/public/css")));
  server.use("/fonts", express.static(path.join(process.cwd(), "/public/fonts")));
  server.use("/sitemap.xml", express.static(path.join(process.cwd(), "/public/sitemap.xml")));

  server.use(async (req: Request, res: Response, next: NextFunction) => {
    // console.log(JSON.stringify({ url: req.url, session: req.session, cookie: req.cookies }, null, 2));
    if (!req.cookies["accessToken"] && req.session.accessToken) {
      res.cookie("accessToken", req.session.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    }
    if (req.cookies?.accessToken && req.session?.accessToken) {
      req.session.accessToken = req.cookies?.accessToken;
    }
    next();
  });
  server.use("/api/user", userRouter);
  server.use("/api/post", postRouter);

  server.use(async (req: Request, res: Response, next: NextFunction) => {
    // console.log("[Server] :", req.url)
    const reqUrls = req.url.split("/");
    const pathname = `/${reqUrls[1]}`;
    if (req.url === "/" || ["/login", "/user", "/post", "/editor", "/tags"].includes(pathname)) {
      nextHandler(req, res);
    } else if (["/api", "/uploads", "/css", "/fonts", "/img"].includes(pathname)) {
      next();
    } else {
      nextHandler(req, res);
    }
  });

  server.use(express.static(path.join(process.cwd(), "/public")));

  const httpsServer =  IS_LOCAL ? https.createServer(options, server) : http.createServer(options, server);
  httpsServer.listen(SERVER_PORT, () => {
    console.log(`[Run Server] ${process.env.NODE_ENV}!`);
    console.log(`[Run Server] PORT:${SERVER_PORT}`);
    console.log(`[Run Server] URL:${HOST_URL}`);
  });
}

const isPreServer = process.env.IS_PRE === "true";
if (isPreServer) {
  console.log("[Run Server] Pre-Server")
  run();
} else {
  app.prepare().then(() => {
    run()
    // process.on('SIGINT', () => {
    //   isAppGoingToBeClosed = true;
    //   console.log('SIGINT signal received.');
    //   server.close(function(err) {
    //     if (err) {
    //       console.error("SIGINT err", err);
    //     }
    //     process.exit(err ? 1 : 0);
    //   });
    // });
  }).catch((err) => {
    console.log("[Run Server Error] Next App server Error!", err)
  });
}
