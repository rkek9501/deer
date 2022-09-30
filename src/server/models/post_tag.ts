import { DataTypes, Model } from "sequelize";

interface PostTagAttributes {
  postId: number;
  tagId: number;
}

export class PostTag extends Model<PostTagAttributes> {
  public readonly postId!: number;
  public readonly tagId!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default (sequelize: any) => {
  PostTag.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: "게시글 아이디"
      },
      tagId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: "태그 아이디"
      }
    },
    {
      sequelize,
      modelName: "post_tag",
      tableName: "post_tag",
      comment: "게시글 태그 관계",
      timestamps: true,
      freezeTableName: true,
      paranoid: false
    }
  );
  return PostTag;
};
