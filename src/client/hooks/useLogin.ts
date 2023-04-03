import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useSWRMutation from "swr/mutation";

import { AppContext } from "@context/index";
import { postFetcher } from "@utils/swrFetcher";

const useLogin = () => {
  const { setLoading } = useContext(AppContext);
  const router = useRouter();
  const [id, setid] = useState("");
  const [pw, setpw] = useState("");
  const [isSaveId, setSaveId] = useState(false);

  const { trigger: login } = useSWRMutation("/api/user/login", postFetcher, {
    throwOnError: false,
    onSuccess(data) {
      if (data?.result) {
        localStorage?.setItem("name", data?.name);
        if (isSaveId) localStorage?.setItem("id", id);
        router.replace("/");
      } else {
        alert("로그인 실패");
        if (!isSaveId) setid("");
        setpw("");  
      }
    },
    onError(error) {
      alert("로그인 실패");
      if (!isSaveId) setid("");
      setpw("");
    }
  });
  
  useEffect(() => {
    const saveId = localStorage?.getItem("id");
    if (saveId) {
      setid(saveId);
      setSaveId(true);
    }
    setLoading(false);
  }, []);

  const btnclick = useCallback(() => {
    if (!id || id.trim().length === 0) return alert("아이디를 입력해주세요.");
    if (!pw || pw.trim().length === 0) return alert("패스워드를 입력해주세요.");
    if (!isSaveId) localStorage?.removeItem("id");

    login({ id, pw });
  }, [id, pw, isSaveId]);

  const onChangeCheck = useCallback((checked: boolean) => {
    setSaveId(checked);
  }, [id]);

  const onKeyPressEnter = (key: string) => {
    if (key.toLowerCase() === "enter") btnclick();
  };

  return {
    id,
    pw,
    setid,
    setpw,
    onKeyPressEnter,
    isSaveId,
    onChangeCheck,
    btnclick
  }
}

export default useLogin;
