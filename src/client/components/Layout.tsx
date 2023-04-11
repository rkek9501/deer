import React from "react";
import styled from "styled-components";

import SHeader from "@components/scrollBar";
import Menu from "@components/Menu";
import useLayout from "@hooks/useLayout";

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
    height: calc(var(--vh, 1vh) * 100 - 70px);
  }
  #scroller.main {
    border-left: solid 2px black;
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
  noneMenu?: boolean;
}

const Layout = (props: EditorProviderProps) => {
  const { isMain, isMobile, ratio, containerRef } = useLayout();

  return (
    <Main>
      <SHeader ratio={ratio} />
      {!props.noneMenu && !isMobile && <Menu />}
      <div id="scroller" className={`${isMain && "main"}`} ref={containerRef}>
        {props.children}
      </div>
    </Main>
  );
};

export default Layout;
