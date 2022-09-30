import React from "react";
import styled from "styled-components";

const FallbackContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 1.6rem;
  padding: 1rem 0;
`;

const Loading = () => <FallbackContainer>Loading...</FallbackContainer>;

export default Loading;
