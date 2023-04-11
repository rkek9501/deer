import React from "react";
import Image from "next/image";
import styled from "styled-components";
import { DotLoader } from "react-spinners";

import Button from "@components/Button";
import Head from "@components/HtmlHead";
import Icons from "@components/Icons";
import ImgCropModal from "@components/ImgCropModal";

import RequestHelper from "@utils/requestHelper";
import useUser, { useChangeUserPw } from "@hooks/useUser";

const UserPageContainer = styled.div`
  padding: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  .user-img-view {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    position: relative;
    cursor: pointer;
    z-index: 1;
    > *:first-child {
      position: relative;
      width: 100px;
      height: 100px;
      border: solid 1px #ff708b !important;
      border-radius: 50px;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      object-fit: cover;
      z-index: -1;
    }
  }
  .user-profiles {
    padding: 0 4rem;
  }
  .no-image-container {
    border-radius: 50px;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 60px;
      height: 60px;
    }
  }
  @media screen and (min-width: 1px) and (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    .user-profiles {
      padding: 4rem 0;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  align-items: center;
  .label {
    width: 60px;
    min-width: 60px;
    font-size: 1.4rem;
    word-break: keep-all;
  }
  input {
    width: 300px;
    height: 30px;
    padding: 0 0.4rem;
  }
`;
const Input = (Props: { label: string; value: string; setValue: any; type?: "text" | "password" }) => {
  return (
    <InputContainer>
      <div className="label">{Props.label}</div>
      <input type={Props.type || "text"} value={Props.value} onChange={(e) => Props.setValue(e.target.value)} />
    </InputContainer>
  );
};

const ExpendabelViewContainer = styled.div`
  width: 100%;
  .expendable-label {
    height: 4rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
    margin-bottom: 1rem;
    font-size: 1.8rem;
    cursor: pointer;

    .chevron-icon {
      transition: all ease 0.5s;
    }
    .chevron-icon.open {
      transform: rotate(0deg);
    }
    .chevron-icon.close {
      transform: rotate(180deg);
    }
  }
  .expendable-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    transition: height 0.5s !important;
    padding: 0 1rem;
    font-size: 1.4rem;
  }
  .expendable-area.open {
    height: 260px !important;
  }
  .expendable-area.close {
    height: 0 !important;
  }
  .change-err {
    color: red;
    height: 20px;
    margin-bottom: 2rem;
    font-weight: bold;
  }
  button {
    font-size: 1.4rem;
  }
`;

const ChangePassView = () => {
  const { open, values, err, setOpen, changeValues, onClickChangePw } = useChangeUserPw();

  return (
    <ExpendabelViewContainer>
      <div className="expendable-label" onClick={() => setOpen(!open)}>
        비밀번호 변경하기
        <Icons.ExpandLess rotate={open ? 180 : 0} />
      </div>
      <div className={`expendable-area ${open ? "open" : "close"}`}>
        <Input label="현재 비밀번호" type="password" value={values.prevPw} setValue={changeValues("prewPw")} />
        <br />
        <Input label="비밀번호" type="password" value={values.nextPw} setValue={changeValues("nextPw")} />
        <Input label="비밀번호 확인" type="password" value={values.nextPwChk} setValue={changeValues("nextPwChk")} />
        <div className="change-err">{err}</div>
        <Button onClick={() => onClickChangePw()}>비밀번호 변경하기</Button>
      </div>
    </ExpendabelViewContainer>
  );
};

const User = () => {
  const {
    image,
    name,
    email,
    modal,
    isLoading,
    error,
    setName,
    setEmail,
    openModal,
    imgChangeCallback,
    CardImgLoader,
    save
  } = useUser();

  if (isLoading)
    return (
      <UserPageContainer>
        <DotLoader color="#005fee" />
      </UserPageContainer>
    );
  if (error) return <UserPageContainer>데이터를 불러오는데 실패하였습니다.</UserPageContainer>;

  return (
    <>
      <Head title="Deer - 내 정보" />
      <UserPageContainer>
        <div className="user-img-view" onClick={openModal}>
          {image ? (
            <Image
              className="user-img"
              src={image}
              width={100}
              height={100}
              unoptimized={true}
              layout={"fixed"}
              loader={CardImgLoader}
              alt="profile-image"
            />
          ) : (
            <div className="no-image-container">
              <Icons.User />
            </div>
          )}
          {modal && <ImgCropModal open={modal} existImg={!!image} callback={imgChangeCallback} />}
        </div>
        <div className="user-profiles">
          <ExpendabelViewContainer>
            <div className="user-info expendable-label">개인정보 수정</div>
            <div className="expendable-area">
              <Input label="이름" value={name} setValue={setName} />
              <Input label="이메일" value={email} setValue={setEmail} />
              <Button onClick={() => save()}>저장하기</Button>
            </div>
          </ExpendabelViewContainer>

          <br />
          <hr />
          <br />
          <ChangePassView />
        </div>
      </UserPageContainer>
    </>
  );
};

User.getInitialProps = async (ctx: any) => {
  const initialCookies = ctx.req?.headers.cookie;
  if (initialCookies) ctx.res?.setHeader("Set-Cookie", initialCookies);

  const { response, error } = await RequestHelper.Get({ url: "/api/user/checkSession" }, initialCookies);
  console.log("User", { response });

  // if (!response?.result || error) {
  //   ctx.res?.writeHead(302, { Location: '/' });
  //   ctx.res?.end();
  // }
  return {
    props: {}
  };
};

export default React.memo(User);
