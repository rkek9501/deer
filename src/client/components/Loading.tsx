import React from "react";
import styled from "styled-components";
import { BeatLoader } from "react-spinners";

const GlobalLoaderContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 10000;
  background-color: #00000066;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GlobalLoader = () => {
  return (
    <GlobalLoaderContainer>
      <BeatLoader color="#005fee" size={60} margin={10} />
    </GlobalLoaderContainer>
  );
};

const FallbackContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 1.6rem;
  padding: 1rem 0;
`;

const Loading = () => <FallbackContainer>Loading...</FallbackContainer>;

export default Loading;
