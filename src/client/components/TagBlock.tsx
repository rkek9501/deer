import React from "react";
import styled, { css } from "styled-components";

import { getTextColorByBackgroundColor } from "@utils";

const TagBtn = styled.button<{ bgColor: string; alwaysOn?: boolean; fontColor: string }>`
  display: inline-block;
  border: none;
  font-size: 1.8rem;
  line-height: 2rem;
  font-family: Arita-dotum-SemiBold;
  margin: 0 1rem 1rem 0;
  color: black;
  padding: 1rem;
  cursor: pointer;
  ${({ alwaysOn, bgColor, fontColor }) =>
    alwaysOn &&
    css`
      background-color: ${bgColor};
      color: ${fontColor};
    `}
  &:hover {
    background-color: ${({ bgColor }) => bgColor};
    color: ${({ fontColor }) => fontColor};
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
  const fontColor = getTextColorByBackgroundColor(color);
  return (
    <TagBtn type="button" alwaysOn={alwaysOn} bgColor={color} fontColor={fontColor} onClick={() => props.onClick?.()}>
      {name}
    </TagBtn>
  );
};

export default tag;
