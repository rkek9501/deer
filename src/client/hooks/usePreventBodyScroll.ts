import { useEffect } from "react";

const usePreventBodyScorll = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
};

export default usePreventBodyScorll;
