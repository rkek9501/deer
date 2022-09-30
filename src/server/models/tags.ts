import { DataTypes, Model } from "sequelize";

interface TagAttributes {
  id: string;
  name: string;
  color: string;
}

export class Tags extends Model<TagAttributes> {
  public readonly id!: number;
  public name!: string;
  public color!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default (sequelize: any) => {
  Tags.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: "태그 아이디"
      },
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        comment: "태그명"
      },
      color: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: "태그색"
      }
    },
    {
      sequelize,
      modelName: "tags",
      tableName: "tags",
      comment: "태그",
      timestamps: true,
      freezeTableName: true,
      paranoid: true
    }
  );
  return Tags;
};
