import session from "express-session";
import FileStore from "session-file-store";
import { SESSION_KEY, HOST_URL } from "../env";
import fs from "fs";
import path from "path";

(() => {
  const sessionDir = path.join(process.cwd(), "./sessions");
  if (!fs.existsSync(sessionDir)) {
    console.log("make sessions dir");
    fs.mkdirSync(sessionDir);
  }
})();

const SessionStore = FileStore(session);

const initSession = session({
  store: new SessionStore(),
  resave: false,
  saveUninitialized: false,
  secret: SESSION_KEY,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    httpOnly: false,
    path: "/",
    domain: HOST_URL
  }
});

export default {
  initSession
};
