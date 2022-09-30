import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import SHeader from "@components/scrollBar";
import Menu from "@components/Menu";
import { AppContext } from "@context/index";

const Main = styled.div`
  width: 100%;
  min-width: 200px;
  display: flex;
  #scroller {
    scroll-behavior: smooth;
    display: flex;
    width: inherit;
    min-width: 200px;
    overflow-x: scroll;
    overflow-y: scroll;
    border-left: solid 2px black;
    height: calc(100vh - 70px);
  }
  @media screen and (min-width: 1px) and (max-width: 480px) {
    width: 100vw;
    min-width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    #scroller {
      border-left: none;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }
`;

interface EditorProviderProps {
  children: React.ReactNode;
}

const Layout = (props: EditorProviderProps) => {
  // const isBrowser = false;
  // if(!isBrowser) return <>aaa</>;
  const { isMobile } = useContext(AppContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(100);

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

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.addEventListener("scroll", onScroll, false);
    }
    return () => containerRef?.current?.removeEventListener("scroll", onScroll, false);
  }, [containerRef]);

  return (
    <Main>
      <SHeader ratio={ratio} />
      {!isMobile && <Menu />}
      <div id="scroller" ref={containerRef}>
        {props.children}
      </div>
    </Main>
  );
};

export default Layout;
