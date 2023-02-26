import moment from "moment";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.originalUrl === "/api/post/upload" ? "uploads" : "uploads/user";
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    let filename = moment().format("YYYYMMDDHHmmss") + "_" + file.originalname;
    const type = file.originalname.split(".");
    if (req.originalUrl !== "/api/post/upload") filename = moment().format("YYYYMMDDHHmmss") + "_" + req.auth?.id + "." + type[type.length - 1];
    cb(null, filename);
  }
});

const upload = multer({ storage: storage }).single("file");

export const remove = async (filePath: string) =>
  new Promise((resolve, reject) => {
    console.log(filePath, "파일을 삭제합니다.");
    const fileAbsolutePath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fileAbsolutePath)) {
      fs.unlink(fileAbsolutePath, (err) => {
        if (err) {
          console.log("fs unlink err", err);
          reject();
        } else {
          console.log("파일을 성공적으로 삭제하였습니다.");
          resolve("unlinked");
        }
      });
    } else {
      console.log("파일이 존재하지 않습니다.");
      resolve("notExist");
    }
  });

export default upload;
