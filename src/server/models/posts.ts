import { Association, DataTypes, Model } from "sequelize";
import { Files } from "./files";
import { PostTag } from "./post_tag";
import { Tags } from "./tags";
import { Users } from "./users";

interface PostAttributes {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  viewCount: number;
  writterId: string;
  openState: string;
}

export class Posts extends Model<PostAttributes> {
  public readonly id!: number;
  public title!: string;
  public subtitle!: string;
  public content!: string;
  public view_count!: number;
  public writterId!: string;
  public openState!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public static associations: {
    postHasManyFiles: Association<Posts, Files>;
    userHasManyPosts: Association<Posts, Users>;
    postHasManyTags: Association<PostTag, Posts>;
    postTagHasOneTag: Association<PostTag, Tags>;
  };
}

export default (sequelize: any) => {
  Posts.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: "게시글 아이디"
      },
      title: {
        type: DataTypes.STRING(256),
        allowNull: false,
        comment: "글제목"
      },
      subtitle: {
        type: DataTypes.STRING(256),
        allowNull: false,
        comment: "글부제목"
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "내용"
      },
      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "조회수"
      },
      writterId: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: "작성자 아이디"
      },
      openState: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: "N",
        comment: "공개 상태"
      }
    },
    {
      sequelize,
      modelName: "posts",
      tableName: "posts",
      comment: "게시글",
      timestamps: true,
      freezeTableName: true,
      paranoid: true
    }
  );

  Posts.belongsToMany(Tags, {
    through: PostTag,
    foreignKey: "postId"
  });
  Tags.belongsToMany(Posts, {
    through: PostTag,
    foreignKey: "tagId"
  });

  Posts.hasMany(Files, {
    sourceKey: "id",
    foreignKey: "post_id"
  });

  Users.hasMany(Posts, {
    sourceKey: "id",
    foreignKey: "writterId"
  });
  Posts.belongsTo(Users, {
    foreignKey: "writterId"
  });

  return Posts;
};
