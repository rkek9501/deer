// utf-8 암복호화
const utf8encode = (value: string) => {
  return unescape(encodeURIComponent(value));
};
const utf8decode = (value: string) => {
  return decodeURIComponent(escape(value));
};

// base64 암복호화
const base64encode = (plaintext: string) => {
  return Buffer.from(plaintext, "utf8").toString("base64");
};
const base64decode = (base64text: string) => {
  return Buffer.from(base64text, "base64").toString("utf8");
};

const utf8 = { encode: utf8encode, decode: utf8decode };

const base64 = { encode: base64encode, decode: base64decode };

export { utf8, base64 };
