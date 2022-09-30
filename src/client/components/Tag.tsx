import React from "react";
import styled, { css } from "styled-components";

const TagBtn = styled.button<{ bgColor: string; alwaysOn?: boolean }>`
  display: inline-block;
  border: none;
  font-size: 1.8rem;
  line-height: 2rem;
  font-family: Arita-dotum-Medium;
  margin: 0 1rem 1rem 0;
  color: black;
  /* margin: 0 0.8rem 0.6rem 0; */
  padding: 1rem;
  cursor: pointer;
  ${({ alwaysOn, bgColor }) =>
    alwaysOn &&
    css`
      background-color: ${bgColor};
    `}
  &:hover {
    background-color: ${({ bgColor }) => bgColor};
    /* opacity: 0.85; */
  }
`;

type tagType = {
  color: string;
  name: string;
  onClick?: any;
  alwaysOn?: boolean;
};
const tag = (props: tagType) => {
  const { color, name, alwaysOn } = props;
  return (
    <TagBtn type="button" alwaysOn={alwaysOn} bgColor={color} onClick={() => props.onClick?.()}>
      {name}
    </TagBtn>
  );
};

export default tag;
