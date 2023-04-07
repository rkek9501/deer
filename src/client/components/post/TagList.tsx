import React from "react";
import styled from "styled-components";

const TagListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 9rem;
`;

const TagList = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  return <TagListWrapper>{children}</TagListWrapper>;
};

export default TagList;
