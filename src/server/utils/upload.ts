import moment from "moment";
import multer from "multer";

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

export default upload;
