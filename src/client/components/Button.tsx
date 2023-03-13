import React from "react";
import styled from "styled-components";

const BtnContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  width: 100%;
  margin-bottom: 1rem;
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  background-color: #c1c1c1;
  &:hover {
    background-color: #a1a1a1;
  }
`;
type BtnProps = {
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

const Button = (props: BtnProps) => {
  return (
    <BtnContainer className={props.className} onClick={props.onClick}>
      {props.children}
    </BtnContainer>
  );
};

export default Button;
