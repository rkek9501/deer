import { Sequelize } from "sequelize";
import { DB_CONFIG } from "../env";
import Files from "./files";
import Posts from "./posts";
import PostTag from "./post_tag";
import Tags from "./tags";
import Users from "./users";

const { USERNAME, PSWD, DATABASE } = DB_CONFIG;

const db: any = {};
export const sequelize = new Sequelize(DATABASE, USERNAME, PSWD, {
  // host: HOST,
  // port: parseInt(PORT),
  // timezone: "+09:00",
  dialect: "sqlite",
  database: DATABASE,
  storage: `${DATABASE}.db`,
  logging: false,
  define: {
    // timestamps: false
  },
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  }
});

// sequelize.sync();
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = Users(sequelize);
db.files = Files(sequelize);
db.tags = Tags(sequelize);
db.post_tag = PostTag(sequelize);
db.posts = Posts(sequelize);

export default db;
