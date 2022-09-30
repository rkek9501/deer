import jwt, { JwtPayload } from "jsonwebtoken";
import { 
  ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_KEY
} from "../env";

export const setAccessToken = (id: string) => {
  const token = jwt.sign({ id }, ACCESS_TOKEN_KEY, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  return token;
};

export const setRefreshToken = (id: string) => {
  const token = jwt.sign({ id }, REFRESH_TOKEN_KEY, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  return token;
};

const getAccessTokenId = (decoded: JwtPayload | string | undefined) => {
  if (typeof decoded !== "string" && typeof decoded?.id !== "undefined") {
    return decoded.id;
  } else return false;
};

export const verifyAccessToken = (token: string): boolean => {
  const verified: any = jwt.verify(token, ACCESS_TOKEN_KEY || "", (error, decoded) => getAccessTokenId(decoded));
  return verified;
};

export const verifyRefreshToken = (token: string) => {
  const verified: any = jwt.verify(token, REFRESH_TOKEN_KEY || "", (error, decoded) => getAccessTokenId(decoded));
  return verified;
};
