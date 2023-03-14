import React, { useEffect, useState } from "react";
import styled from "styled-components";

type FAB = {
  bottom: number;
  size?: number | null;
  bgColor?: string | null | undefined;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

const FloatingWrapper = styled.div<FAB>`
  position: fixed;
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
  z-index: 2;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: height 0.3s;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: #eee;
  }

  right: 10px;
  /* smartphones, iPhone, portrait 480x320 phones */
  @media (min-width: 1px) and (max-width: 480px) {
    right: 2rem;
  }
  @media (min-width: 481px) and (max-width: 1140px) {
    right: 4rem;
  }
  /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
  @media (min-width: 1141px) {
    right: 20rem;
  }
`;

const FloatingButton = (props: FAB) => {
  return (
    <FloatingWrapper bottom={props.bottom} size={props.size} bgColor={props.bgColor} onClick={props.onClick}>
      {props.children}
    </FloatingWrapper>
  );
};

export default FloatingButton;
