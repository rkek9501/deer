import React from "react";
import styled from "styled-components";

const TagList = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 9rem;
`;

export default ({ children }: { children: React.ReactNode | React.ReactNode[] }) => <TagList>{children}</TagList>;
