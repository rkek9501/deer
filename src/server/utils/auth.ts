import {
  verifyAccessToken, verifyRefreshToken,
  setAccessToken, setRefreshToken
} from "./jwt";
import type { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from "../env";

// 접근권한 확인 (POST, PUT, DELETE)
const accessCheck = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.session?.accessToken || req.cookies?.accessToken || "";
  const refreshToken = req.session?.refreshToken || "";

  const accessable =  verifyAccessToken(accessToken);
  const refreshable = verifyRefreshToken(refreshToken);

  if (!accessable && refreshable) {
    refreshingTokens(refreshable, req, res)
  }
  if (!accessable) {
    console.log("un authrized");
    return res.sendStatus(401);
  }
  if (!req.auth) {
    req.auth = {
      verified: true,
      id: accessable
    };
  }
  next();
};

// 사용자 인증 로그인 여부 체크 (GET)
const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.session?.accessToken || req.cookies?.accessToken || "";
  const refreshToken = req.session?.refreshToken || "";
  
  const accessable =  verifyAccessToken(accessToken);
  const refreshable = verifyRefreshToken(refreshToken);

  if (!accessable && refreshable) {
    refreshingTokens(refreshable, req, res)
  }
  if (accessToken && !req.auth) {
    req.auth = {
      verified: true,
      id: accessable
    };
  } else {
    req.auth = null;
  }
  next();
};

// accessToken 갱신
const refreshingTokens = (id: string, req: Request, res: Response) => {
  const newAccessToken = setAccessToken(id);
  const newRefreshToken = setRefreshToken(id);

  req.session.accessToken = newAccessToken;
  req.session.refreshToken = newRefreshToken;
  req.session.save((err: any) => console.log("save Error", err));

  res.cookie("accessToken", newAccessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  // res.cookie("refreshToken", newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
}

export { authCheck, accessCheck };
