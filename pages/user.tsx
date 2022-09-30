import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Button } from "@mui/material";

import { AppContext } from "@context/index";
import Layout from "@components/Layout";
import ImgCropModal from "@components/ImgCropModal";
import RequestHelper from "@utils/requestHelper";
import { base64 } from "@utils/crypto";

const UserPageContainer = styled.div`
  padding: 4rem;
  display: flex;
  flex-direction: row;
  .user-img-view {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    position: relative;
    z-index: 1;
    input {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 2;
      opacity: 0;
    }
    img.user-img {
      position: relative;
      width: 100px;
      height: 100px;
      border: solid 2px #ff708b;
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
type ErrType = boolean | string;
const ChangePassView = React.memo(() => {
  const { logout } = useContext(AppContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [prevPw, setPrevPw] = useState("");
  const [nextPw, setNextPw] = useState("");
  const [nextPwChk, setNextPwChk] = useState("");
  const [err, setErr] = useState<ErrType>(false);

  useEffect(() => {
    setErr(false);
  }, [prevPw, nextPw, nextPwChk]);

  const changePw = useCallback(() => {
    setErr(false);
    let msg: ErrType = false;
    if (prevPw.length === 0) {
      msg = "현재 비밀번호를 입력해주세요.";
    } else if (nextPw.length === 0) {
      msg = "비밀번호를 입력해주세요.";
    } else if (prevPw === nextPw) {
      msg = "현재 비밀번호와 동일하게 변경할 수 없습니다.";
    } else if (nextPw !== nextPwChk) {
      msg = "비밀번호가 일치하지 않습니다.";
    }
    if (msg) {
      return setErr(msg);
    } else {
      (async () => {
        const { response, error } = await RequestHelper.Put({
          url: "/api/user/changePassword",
          body: { prevPw: base64.encode(prevPw), nextPw: base64.encode(nextPw) }
        });
        if (error) {
          return setErr("비밀번호 변경중 오류가 발생하였습니다.");
        }
        if (response.result) {
          await RequestHelper.Get({ url: "/api/user/logout" });
          logout();
          alert("로그인 후 다시 이용해주세요.");
          router.push("/");
        } else {
          return setErr(response.message);
        }
      })();
    }
  }, [prevPw, nextPw, nextPwChk]);

  return (
    <ExpendabelViewContainer>
      <div className="expendable-label" onClick={() => setOpen(!open)}>
        비밀번호 변경하기
        <ExpandLessIcon className={`chevron-icon ${open ? "open" : "close"}`} />
      </div>
      <div className={`expendable-area ${open ? "open" : "close"}`}>
        <Input label="현재 비밀번호" type="password" value={prevPw} setValue={setPrevPw} />
        <br />
        <Input label="비밀번호" type="password" value={nextPw} setValue={setNextPw} />
        <Input label="비밀번호 확인" type="password" value={nextPwChk} setValue={setNextPwChk} />
        <div className="change-err">{err}</div>
        <Button variant="contained" onClick={() => changePw()}>
          비밀번호 변경하기
        </Button>
      </div>
    </ExpendabelViewContainer>
  );
});

type ImageTypes = {
  data: any;
  url: string | null;
};

const User = () => {
  const [origin, setOrigin] = useState({ name: null, email: null, image: null });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState<ImageTypes>({ data: null, url: null });
  const [modal, setModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { response, error } = await RequestHelper.Get({ url: "/api/user/profile" });
      if (response?.user) {
        const { name, email, image } = response.user;
        setOrigin({ name, email, image });
        setName(name || "");
        setEmail(email || "");
        setImage(image);
      } else {
      }
    })();
  }, []);

  const onChangeFile = (e: any) => {
    const data = e.target.files[0];
    const blobUrl = URL.createObjectURL(data).toString();
    setFile({ data, url: blobUrl });
    setModal(true);
  };

  const save = useCallback(async () => {
    const params: { name?: string; email?: string } = {};
    if (name && name.trim().length !== 0) {
      params.name = name;
    }
    if (email && email.trim().length !== 0) {
      params.email = email;
    }
    const { response, error } = await RequestHelper.Put({ url: "/api/user/changeProfile", body: params });

    if (response.result) {
      alert("수정되었습니다.");
      router.reload();
    }
  }, [name, email]);

  const imgChangeCallback = useCallback(
    async (data: any) => {
      setImage(data);

      let blob = await fetch(data).then((r) => r.blob());
      const temp = new File([blob], file.data.name, {
        type: blob.type
      });
      const response = await RequestHelper.Upload(temp, "user");
    },
    [file]
  );

  return (
    <Layout>
      <UserPageContainer>
        <div className="user-img-view">
          <input type="file" onChange={onChangeFile} accept="image/jpg,impge/png,image/jpeg,image/gif" />
          {<img className="user-img" src={image || ""} />}
          {modal && <ImgCropModal open={modal} onClose={() => setModal(false)} file={file} callback={imgChangeCallback} />}
        </div>
        <div className="user-profiles">
          <ExpendabelViewContainer>
            <div className="user-info expendable-label">개인정보 수정</div>
            <div className="expendable-area">
              <Input label="이름" value={name} setValue={setName} />
              <Input label="이메일" value={email} setValue={setEmail} />
              <Button variant="contained" onClick={() => save()}>
                저장하기
              </Button>
            </div>
          </ExpendabelViewContainer>

          <br />
          <hr />
          <br />
          <ChangePassView />
        </div>
      </UserPageContainer>
    </Layout>
  );
};


User.getInitialProps = async (ctx: any) => {
  const initialCookies = ctx.req?.headers.cookie;
  if (initialCookies) ctx.res?.setHeader('Set-Cookie', initialCookies);

  const { response, error } = await RequestHelper.Get({ url: "/api/user/checkSession" }, initialCookies);

  if (!response?.result || error) {
    ctx.res?.writeHead(302, { Location: '/' });
    ctx.res?.end();
  }
  return {
    props: { },
  };
}

export default User;
