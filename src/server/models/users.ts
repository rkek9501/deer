import { DataTypes, Model } from "sequelize";

interface UserAttributes {
  id: string;
  name: string;
  password: string;
  email: string;
  image: string;
  loginFailCount: number;
  loginAt: Date;
  token: string;
}

export class Users extends Model<UserAttributes> {
  public readonly id!: number;
  public name!: string;
  public password!: string;
  public email!: string;
  public image!: string;
  public loginFailCount!: number;
  public loginAt!: Date;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default (sequelize: any) => {
  Users.init(
    {
      id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        comment: "사용자 아이디"
      },
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        comment: "사용자 이름"
      },
      password: {
        type: DataTypes.STRING(256),
        allowNull: false,
        comment: "사용자 비밀번호"
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: "사용자 이메일"
      },
      image: {
        type: DataTypes.STRING(256),
        allowNull: true,
        comment: "사용자 프로필 이미지"
      },
      loginFailCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "로그인 실패 횟수"
      },
      loginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "로그인 일시"
      },
      token: {
        type: DataTypes.STRING(512),
        allowNull: true,
        comment: "refresh token"
      }
    },
    {
      sequelize,
      modelName: "users",
      tableName: "users",
      comment: "사용자",
      timestamps: true,
      freezeTableName: true,
      paranoid: true
    }
  );

  return Users;
};
