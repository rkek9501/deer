import bcrypt from "bcrypt";

// 단방향 해싱.
const hash = (pass: string) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(pass, salt, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });

// 비교.
const compare = (pass: string, hash: string) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(pass, hash, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

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

export { hash, compare, utf8, base64 };
