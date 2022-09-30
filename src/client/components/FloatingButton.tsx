import React, { useEffect, useState } from "react";
import styled from "styled-components";

type FAB = {
  bottom: number;
  size?: number | null;
  bgColor?: string | null | undefined;
  onClick?: any;
  children: React.ReactNode;
  isFixed?: boolean;
};

const FloatingWrapper = styled.div<FAB>`
  position: ${(props) => (props.isFixed ? "fixed" : "absolute")};
  bottom: 0;
  top: auto;
  bottom: ${(props) => props.bottom}px;
  width: ${(props) => props.size || 50}px;
  height: ${(props) => props.size || 50}px;
  background-color: ${(props) => props.bgColor || "greenyellow"};
  border-radius: ${(props) => (props.size || 50) / 2}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  z-index: 1;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: height 0.3s;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: #eee;
  }

  right: 10px;
  /* smartphones, iPhone, portrait 480x320 phones */
  @media (min-width: 1px) and (max-width: 480px) {
    right: ${(props) => (props.isFixed ? "2rem" : "0")};
  }
  /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
  @media (min-width: 481px) {
    right: ${(props) => (props.isFixed ? "22rem" : "20rem")};
  }
`;

const FloatingButton = (props: FAB) => {
  const [isFixed, setFixed] = useState(true);
  useEffect(() => {
    const end = document.getElementById("content-end");
    const scroller = document.getElementById("scroller");
    const onScroll = () => {
      const clientHeight = scroller?.clientHeight || 0;
      const scrollTop = scroller?.scrollTop || 0;
      if (end?.offsetTop) {
        if (end?.offsetTop > scrollTop + clientHeight) setFixed(true);
        else setFixed(false);
      }
    };
    scroller?.addEventListener("scroll", onScroll, false);
    return () => scroller?.removeEventListener("scroll", onScroll, false);
  }, []);

  return (
    <FloatingWrapper isFixed={isFixed} bottom={props.bottom} size={props.size} bgColor={props.bgColor} onClick={props.onClick}>
      {props.children}
    </FloatingWrapper>
  );
};

export default FloatingButton;
