import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import styled from "styled-components";

import Button from "@components/Button";
import Checkbox from "@components/Checkbox";
import requestHelper from "@utils/requestHelper";

const PageContainer = styled.div`
  padding: 8rem 4rem 2rem;

  .login-content {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    justify-content: space-evenly;
    align-items: center;
    width: 350px;
    height: 380px;
    border: 1px solid rgba(var(--b6a, 219, 219, 219), 1);
    border-radius: 1px;
    background: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    margin: 0 auto;
    margin-top: 4rem;
  }

  .title {
    font-size: 2.4rem;
    font-family: score9;
  }
  .title.title-deer {
    font-family: Futura-Bold;
  }
  .loginbtn {
    width: 100%;
    font-family: score4;
    font-size: 1.4rem;
  }

  .login-input-box {
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 268px;
  }

  form input {
    height: 28px;
    margin-bottom: 1rem;
    &.id {
      font-family: score4;
      font-size: 1.4rem;
    }
  }

  .save-id-text {
    font-family: score4;
    font-size: 1.4rem;
  }

  .login-pw-check {
    margin-top: 5rem;
    font-size: 1.3rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    color: #00376b;
    cursor: pointer;
  }

  @media screen and (min-width: 1px) and (max-width: 480px) {
    padding: 0;
    .login-content {
      border: none;
      background: white;
      box-shadow: none;
      margin: 0 auto;
      /* margin-top: 4rem; */
    }
  }
`;
const Login = () => {
  // const { session } = useContext(AppContext);
  const router = useRouter();
  const [id, setid] = useState("");
  const [pw, setpw] = useState("");
  const [isSaveId, setSaveId] = useState(false);

  useEffect(() => {
    const saveId = localStorage?.getItem("id");
    if (saveId) {
      setid(saveId);
      setSaveId(true);
    }
  }, []);

  // useEffect(() => {
  //   if (session) router.push("/");
  // }, [session]);

  const btnclick = useCallback(() => {
    if (!id || id.trim().length === 0) return alert("아이디를 입력해주세요.");
    else if (!pw || pw.trim().length === 0) return alert("패스워드를 입력해주세요.");
    (async () => {
      if (!isSaveId) {
        localStorage?.removeItem("id");
      }
      const { response, error } = await requestHelper.Post({ url: "/api/user/login", body: { id: id, pw: pw } });
      console.log({response})
      if (error) {
        alert("로그인 실패");
        if (!isSaveId) setid("");
        setpw("");
      } else {
        localStorage?.setItem("name", response.name);
        if (isSaveId) localStorage?.setItem("id", id);
        router.push("/");
      }
    })();
  }, [id, pw, isSaveId]);

  const onChangeCheck = useCallback((checked: boolean) => {
    setSaveId(checked);
  }, [id]);

  const onKeyPressEnter = (key: string) => {
    if (key.toLowerCase() === "enter") btnclick();
  };

  return (
    <PageContainer>
      <Helmet>
        <title>Deer Login</title>
      </Helmet>
      <div className="login-content">
        <div className="title title-deer">DEER</div>
        <form className="login-input-box">
          <input name="id" type="text" placeholder="전화번호, 사용자 이름 또는 이메일" value={id} onChange={(e) => setid(e.target.value)} />
          <input
            name="pw"
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setpw(e.target.value)}
            onKeyPress={(e) => onKeyPressEnter(e.key)}
          />
          <Checkbox checked={isSaveId} onChange={onChangeCheck} label="아이디 저장하기" />
          <br />
          <div>
            <Button className="loginbtn" color="primary" onClick={btnclick}>
              로그인
            </Button>
          </div>
        </form>
        {/* <div className="login-pw-check">비밀번호를 잊으셨나요?</div> */}
      </div>
    </PageContainer>
  );
};

Login.getInitialProps = async (ctx: any) => {
  const initialCookies = ctx.req?.headers.cookie;
  if (initialCookies) ctx.res?.setHeader('Set-Cookie', initialCookies);
  const { response } = await requestHelper.Get({ url: "/api/user/checkSession" }, initialCookies);

  if (response?.result) {
    ctx.res?.writeHead(302, { Location: '/' });
    ctx.res?.end();
  }
  return {
    props: { },
  };
}

export default Login;
