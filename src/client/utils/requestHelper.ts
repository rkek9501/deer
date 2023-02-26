import axios from "axios";
import https from "https";
import { getToken, getAllCookies } from "./tokenManager";

type GetRequestType = {
  url: string;
  query?: object;
  setLoadMask?: any;
};
type RequestType = {
  url: string;
  body?: object;
  setLoadMask?: any;
};
type DeleteRequestType = {
  url: string;
  query?: object;
  body?: object;
  setLoadMask?: any;
};

const createQuery = (datas: any) => {
  let body = "";

  for (let key in datas) {
    if (datas[key] || Number.isInteger(datas[key])) {
      if (body !== "") {
        body += "&";
      }
      body += encodeURIComponent(key) + "=" + encodeURIComponent(datas[key]);
    }
  }
  return body === "" ? "" : `?${body}`;
};

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.HOST_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false //허가되지 않은 인증을 reject하지 않겠다!
  })
});

const requestFetch = (url: string, options: object, setLoadMask: any) => {
  if (setLoadMask) setLoadMask(true);

  return axiosInstance({ url, ...options })
    .then((response) => {
      if (response.status !== 200 && !response.data) {
        return Promise.reject(response);
      }
      return response.data;
    })
    .then((response) => {
      return { response, error: null };
    })
    .catch((err) => {
      return { response: null, error: err };
    })
    .finally(() => {
      if (setLoadMask) setLoadMask(false);
    });
};

const Get = async (request: GetRequestType, cookies?: string) => {
  const { url, query, setLoadMask } = request;
  const path = url + createQuery(query);
  const config: any = {
    method: "GET",
    headers: {
      Authorization: "",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  };

  if (cookies) {
    config.headers.Cookie = cookies;
  }
  const token = getAllCookies();

  return requestFetch(path, config, setLoadMask);
};

const CheckAuth = async (cookies?: string) => {
  // const { url, query, setLoadMask } = request;
  const path = "/api/user/chechSession";
  const config: any = {
    method: "GET",
    headers: {
      Authorization: "",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  };

  if (cookies) {
    config.headers.Cookie = cookies;
  }

  return requestFetch(path, config, null);
};

const Post = async (request: RequestType) => {
  const { url, body, setLoadMask } = request;

  const config = {
    method: "POST",
    headers: {
      Authorization: "",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    data: JSON.stringify(body)
  };
  const token = getToken() || null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return requestFetch(url, config, setLoadMask);
};

const Put = async (request: RequestType) => {
  const { url, body, setLoadMask } = request;

  const config = {
    method: "PUT",
    headers: {
      Authorization: "",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    data: JSON.stringify(body)
  };
  const token = getToken() || null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return requestFetch(url, config, setLoadMask);
};

const Delete = async (request: DeleteRequestType) => {
  const { url, query, body, setLoadMask } = request;

  const path = url + createQuery(query);
  const config = {
    method: "DELETE",
    headers: {
      Authorization: "",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    data: JSON.stringify(body)
  };
  const token = getToken() || null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return requestFetch(path, config, setLoadMask);
};

const Upload = async (file: any, type: "content" | "user") => {
  const formData = new FormData();
  formData.append("file", file);

  const headers = {
    Authorization: "",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "multipart/form-data"
  };
  const token = getToken() || null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return await axiosInstance({
    method: "post",
    url: `${process.env.HOST_URL}${type === "content" ? "/api/post/upload" : "/api/user/upload"}`,
    data: formData,
    headers
  })
    .then((res) => {
      // console.log(res);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      return null;
    });
};

export default { Get, Post, Put, Delete, Upload, CheckAuth };
