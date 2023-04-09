import React from "react";
import styled from "styled-components";

const NotFound = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 60px);
  max-height: calc(var(--vh, 1vh) * 100 - 60px);
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-family: "score5";
`;

const NotFoundPage = () => <NotFound>404 Page Not Found.</NotFound>;

export default NotFoundPage;
