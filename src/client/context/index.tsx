import React, { createContext, useCallback, useEffect, useState } from "react";
import { checkToken, clearToken } from "@utils/tokenManager";
import requestHelper from "@utils/requestHelper";
import { GlobalLoader } from "@components/Loading";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppContext = createContext({
  logout: (path?: string) => {},
  page: "/",
  setPage: (path: string) => {},
  tags: [],
  isMobile: false,
  loading: false,
  setLoading: (loading: boolean) => {}
});

const AppProvider = (props: AppProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("/");
  const [isMobile, setMobild] = useState(false);
  const [tags, setTags] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const { response, error } = await requestHelper.Get({ url: "/api/tag" });
      if (response?.data) setTags(response.data);
    })();
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setMobild(true);
      } else {
        setMobild(false);
      }
      // console.log(window.innerWidth, window.outerWidth)
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logout = useCallback((path?: string) => {
    clearToken();
    localStorage?.removeItem("name");
    if (path) setPage(path);
    else setPage("/");
    location.href = path || "/";
  }, []);

  useEffect(() => {
    (async () => {
      const hasToken = checkToken();
      if (!hasToken && (page.indexOf("/editor") !== -1 || page.indexOf("/user") !== -1 || page.indexOf("/tag") !== -1)) {
        alert("로그인 후 이용해주세요.");
        logout("/login");
      }
    })();
  }, [page]);

  const values = {
    logout,
    page,
    setPage,
    tags,
    isMobile,
    loading,
    setLoading
  };
  return (
    <AppContext.Provider value={values}>
      {props.children}
      {loading && <GlobalLoader />}
    </AppContext.Provider>
  );
};

export default AppProvider;
