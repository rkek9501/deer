import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

import { AppContext } from "@context/index";

const useLayout = () => {
  const { isMobile } = useContext(AppContext);
  const [ratio, setRatio] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const isMain = useMemo(() => router.pathname === "/", [router.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const target = containerRef.current;

      const scrollTop = target?.scrollTop || 0;
      const offsetHeight = target?.offsetHeight || 0;
      const scrollHeight = target?.scrollHeight || 0;
      const scrollY = scrollTop;
      const pageHeight = scrollHeight - offsetHeight;
      const ratio = 100 - (isNaN(scrollY / pageHeight) ? 0 : scrollY / pageHeight) * 100;
      setRatio(ratio);
    };

    if (containerRef?.current) {
      containerRef.current.addEventListener("scroll", onScroll, false);
    }
    return () => containerRef?.current?.removeEventListener("scroll", onScroll, false);
  }, [containerRef]);

  return {
    isMain,
    isMobile,
    ratio,
    containerRef
  };
};

export default useLayout;
