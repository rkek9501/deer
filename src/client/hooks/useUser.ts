import { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import imageCompression from "browser-image-compression";

import { AppContext } from "@context/index";
import { getFetcher, putFetcher } from "@utils/swrFetcher";
import { base64toFile } from "@utils/image";
import { base64 } from "@utils/crypto";
import RequestHelper from "@utils/requestHelper";

export const useChangeUserPw = () => {
  const { logout } = useContext(AppContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [prevPw, setPrevPw] = useState("");
  const [nextPw, setNextPw] = useState("");
  const [nextPwChk, setNextPwChk] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const { trigger: requestChangePassword } = useSWRMutation("/api/user/changePassword", putFetcher, {
    throwOnError: false,
    onSuccess(data) {
      if (data.result) {
        logout();
        alert("로그인 후 다시 이용해주세요.");
        router.push("/");
      } else {
        setErr(data.message);
      }
    },
    onError(error) {
      setErr("비밀번호 변경중 오류가 발생하였습니다.");
    }
  });

  useEffect(() => {
    setErr(null);
  }, [prevPw, nextPw, nextPwChk]);

  const onClickChangePw = useCallback(() => {
    if (prevPw.length === 0) return setErr("현재 비밀번호를 입력해주세요.");
    if (nextPw.length === 0) return setErr("비밀번호를 입력해주세요.");
    if (prevPw === nextPw) return setErr("현재 비밀번호와 동일하게 변경할 수 없습니다.");
    if (nextPw !== nextPwChk) return setErr("비밀번호가 일치하지 않습니다.");
    setErr(null);

    requestChangePassword({ prevPw: base64.encode(prevPw), nextPw: base64.encode(nextPw) });
  }, [prevPw, nextPw, nextPwChk]);

  const changeValues = useCallback(
    (type: "prewPw" | "nextPw" | "nextPwChk") => (value: string) => {
      console.log({ type, value });
      if (type === "prewPw") setPrevPw(value);
      if (type === "nextPw") setNextPw(value);
      if (type === "nextPwChk") setNextPwChk(value);
    },
    []
  );

  return {
    open,
    values: {
      prevPw,
      nextPw,
      nextPwChk
    },
    err,
    setOpen,
    changeValues,
    onClickChangePw
  };
};

const useUser = () => {
  const { setLoading } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [modal, setModal] = useState(false);
  const router = useRouter();

  const { data, isLoading, error } = useSWR("/api/user/profile", getFetcher, {
    onSuccess(data) {
      if (data?.user) {
        const { name, email, image } = data.user;
        setName(name || "");
        setEmail(email || "");
        setImage(image);
      } else {
        alert("프로필 변경 중 오류가 발생하였습니다. 잠시 후 다시시도해 주세요.");
      }
      setLoading(false);
    },
    onError(error) {
      alert("프로필 변경 중 오류가 발생하였습니다. 잠시 후 다시시도해 주세요.");
      setLoading(false);
    }
  });

  const { trigger: requestChangeUserInfo } = useSWRMutation("/api/user/changeProfile", putFetcher, {
    throwOnError: false,
    onSuccess(data) {
      if (data.result) {
        alert("수정되었습니다.");
        router.reload();
      } else {
        alert("프로필 변경 중 오류가 발생하였습니다. 잠시 후 다시시도해 주세요.");
      }
    },
    onError(error) {
      alert("프로필 변경 중 오류가 발생하였습니다. 잠시 후 다시시도해 주세요.");
    }
  });

  const { trigger: requestRemoveProfileImg } = useSWRMutation("/api/user/removeProfileImg", putFetcher, {
    throwOnError: false,
    onSuccess(data) {
      if (data.result) {
        setImage(null);
      } else {
        alert("프로필 이미지 삭제 중 오류가 발생하였습니다. 잠시 후 다시시도해 주세요.");
      }
    },
    onError(error) {
      alert("프로필 이미지 삭제 중 오류가 발생하였습니다. 잠시 후 다시시도해 주세요.");
    }
  });

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const save = useCallback(async () => {
    if (data) {
      if (data?.user?.name === name && data?.user?.email === email) {
        return alert("수정된 값이 없습니다.");
      }

      const params: { name?: string; email?: string } = {};
      if (name && name.trim().length !== 0) params.name = name;
      if (email && email.trim().length !== 0) params.email = email;

      requestChangeUserInfo(params);
    }
  }, [data, name, email]);

  const requestChangeProfileImg = useCallback(async (data: any, name: string | null) => {
    let blob = await fetch(data).then((r) => r.blob());
    const temp = new File([blob], name || "jpg", {
      type: blob.type
    });
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 512
    };

    try {
      const compressedBlob = await imageCompression(temp, options);
      imageCompression.getDataUrlFromFile(compressedBlob).then(async (result) => {
        const transfromedFile = base64toFile(result, name || "jpg");
        const response = await RequestHelper.Upload(transfromedFile, "user");
        if (response?.result) {
          setImage(data);
        } else {
          alert("프로필 변경 중 오류가 발생하였습니다. 잠시 후 다시시도해 주세요.");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const imgChangeCallback = (cb: { type: "close" | "remove" | "change"; data: any; name: string | null }) => {
    switch (cb.type) {
      case "remove":
        requestRemoveProfileImg({});
        break;
      case "change":
        requestChangeProfileImg(cb.data, cb.name);
        break;
      default:
        break;
    }
    closeModal();
  };

  const CardImgLoader = ({ src }: { src: string }) => {
    return `${src}`;
  };

  return {
    image,
    modal,
    name,
    email,
    isLoading,
    error,
    setName,
    setEmail,
    openModal,
    imgChangeCallback,
    CardImgLoader,
    save
  };
};

export default useUser;
