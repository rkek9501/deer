import React from "react";
import Image from "next/image";
import styled from "styled-components";
import useDate from "@hooks/useDate";

const UserIcon = styled.div`
  width: 40px !important;
  height: 40px !important;
  border: 2px solid #ff708b;
  box-sizing: border-box;
  border-radius: 20px;
  margin: 0 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: bold;
  img {
    width: 40px !important;
    height: 40px !important;
    border: 2px solid #ff708b;
    box-sizing: border-box;
    border-radius: 20px;
    margin: 0 1.2rem;
    display: flex;
    align-items: center;
  }
`;
const UserBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 2.5rem;
`;
const UserTextContainer = styled.div`
  font-family: Arita-dotum-Medium;
  font-style: normal;
  font-weight: 400px;
  font-size: 1.6rem;
  line-height: 1.9rem;
  color: #333333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (min-width: 1px) and (max-width: 480px) {
    font-size: 13px;
  }
`;

const ProfileImgLoader = ({ src }: { src: string }) => `${src}`;

type UserData = {
  name: string;
  image?: string | null;
  date: string;
};
const UserView = (user: UserData) => {
  const date = useDate(user.date);
  const icon = user.image
    ? <Image src={user.image} alt={user.name} width={40} height={40} loader={ProfileImgLoader}/>
    : user.name?.charAt(0).toUpperCase();

  return (
    <UserBoxContainer>
      <UserIcon>{icon}</UserIcon>
      <UserTextContainer>
        <div>{user.name}</div>
        <div>{date}</div>
      </UserTextContainer>
    </UserBoxContainer>
  );
};

export default UserView;
