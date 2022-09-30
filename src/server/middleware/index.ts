import express from "express";
import type { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import timeout from "connect-timeout";
import cors from "cors";
import helmet from "helmet";

import session from "./session";
import logger from "./logger";
import { IS_DEV, HOST_URL } from "../env";

const CorsOptions = {
  // origin: IS_DEV ? true : String(HOST_URL),
  origin: true,
  credentials: true,
};

const applyMiddlewares = (server: Express) => {
  server.set("trust proxy", true);
  
  server.use(compression());
  server.use(timeout("55s"));
  
  server.use(helmet.dnsPrefetchControl());
  server.use(helmet.expectCt());
  server.use(helmet.hidePoweredBy());
  server.use(helmet.hsts());
  server.use(helmet.noSniff());
  server.use(helmet.permittedCrossDomainPolicies());
  server.use(helmet.referrerPolicy());
  server.use(helmet.xssFilter());
  server.use(cors(CorsOptions));
  
  server.use(bodyParser.json({ limit: "10mb" }));
  server.use(express.urlencoded({ extended: true, limit: "10mb" }));
  server.use(logger);
  
  server.use(session.initSession);
  server.use(cookieParser());

  return server;
}

export default applyMiddlewares;
