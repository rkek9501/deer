import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const IS_DEV = Boolean(process.env.NODE_ENV !== "production");

export const IS_LOCAL = Boolean(process.env.IS_LOCAL === "yes");
export const SERVER_PORT = Number(process.env.SERVER_PORT) || 5000;
export const SERVER_URL = String(process.env.SERVER_URL) || "localhost"
export const HOST_URL = IS_LOCAL ? `https://${SERVER_URL}:${SERVER_PORT}` : `https://${SERVER_URL}`;

interface CONFIG {
  DATABASE: string;
  USERNAME: string;
  PSWD: string;
  HOST: string;
  PORT: string;
}
export const DB_CONFIG: CONFIG = {
  DATABASE: process.env.DB_NAME || "",
  USERNAME: process.env.DB_USER || "root",
  PSWD: process.env.DB_PSWD || "",
  HOST: process.env.DB_HOST || "",
  PORT: process.env.DB_PORT || "3306"
};

export const SESSION_KEY = String(process.env.SESSION_KEY) || "deer";
export const ACCESS_TOKEN_EXPIRES_IN = "24h";
export const REFRESH_TOKEN_EXPIRES_IN = "2d";
export const STATIC_FILE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24;
const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 2;

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  maxAge: ACCESS_TOKEN_MAX_AGE,
  httpOnly: false,
  secure: !IS_DEV,
  path: "/",
};

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  maxAge: REFRESH_TOKEN_MAX_AGE,
  httpOnly: false,
  secure: !IS_DEV,
  path: "/",
};

export const ACCESS_TOKEN_KEY = String(process.env.ACCESS_TOKEN_KEY);
export const REFRESH_TOKEN_KEY = String(process.env.REFRESH_TOKEN_KEY);
