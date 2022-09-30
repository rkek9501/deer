import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const getAllCookies = () => {
  return cookies.getAll();
}

export const getToken = () => {
  return cookies.get("accessToken");
}

export const checkToken = () => {
  console.log("checkToken", cookies?.get("accessToken"));
  return !!cookies.get("accessToken");
}

export const clearToken = () => {
  cookies.remove("accessToken");
  // cookies.remove("refreshToken");
}

export const setCookie = (key: string, value: string) => {
  cookies.set(key, value, { path: "/" });
}

export default {};
