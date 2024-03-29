// import routes from "next-routes";
import postRouter from "./post";
import userRouter from "./user";
import tagRouter from "./tag";

const routes = require("next-routes");

export default routes().add("post").add("post/:id").add("editor").add("editor/:id").add("login").add("user");

export { postRouter, userRouter, tagRouter };
