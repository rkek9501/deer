import { DataTypes, Model } from "sequelize";

interface FileAttributes {
  post_id: number;
  order: number;
  origin_name: string;
  s3Path: string;
}

export class Files extends Model<FileAttributes> {
  public readonly post_id!: number;
  public order!: number;
  public origin_name!: string;
  public s3Path!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default (sequelize: any) => {
  Files.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: "게시글 아이디"
      },
      order: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: "파일 순서"
      },
      origin_name: {
        type: DataTypes.STRING(128),
        allowNull: false,
        primaryKey: true,
        comment: "원본 파일명"
      },
      s3Path: {
        type: DataTypes.STRING(256),
        allowNull: false,
        comment: "S3 파일 경로"
      }
    },
    {
      sequelize,
      modelName: "files",
      tableName: "files",
      comment: "게시글 파일",
      timestamps: true,
      freezeTableName: true,
      paranoid: true
    }
  );
  return Files;
};
