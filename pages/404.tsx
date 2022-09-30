import React from "react";
import styled from "styled-components";

const NotFound = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-family: "score5";
`;

const NotFoundPage = () => <NotFound>404 Page Not Found.</NotFound>;

export default NotFoundPage;
