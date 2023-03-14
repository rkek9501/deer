import https from "https";
import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.HOST_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false //허가되지 않은 인증을 reject하지 않겠다!
  })
});

const headers = {
  Authorization: "",
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json"
};

export const getFetcher = (url: string) => {
  return axiosInstance({
    url,
    headers,
    method: 'GET',
  }).then((response) => response.data);
};

export async function postFetcher(url: string, { arg }: { arg: any }) {
  return axiosInstance({
    url,
    headers,
    method: 'POST',
    data: JSON.stringify(arg),
  }).then((response) => response.data);
}

export async function putFetcher(url: string, { arg }: { arg: any }) {
  return axiosInstance({
    url,
    headers,
    method: 'PUT',
    data: JSON.stringify(arg),
  }).then((response) => response.data);
}

export async function deleteFetcher(url: string) {
  return axiosInstance({
    url,
    headers,
    method: 'DELETE'
  }).then((response) => response.data);
}