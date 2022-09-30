import styled from "styled-components";

export const Header = styled.div`
  width: 100%;
  height: 0.5rem;
  position: fixed;
  top: 0;
  z-index: 999;
  background: white;
`;

interface ScrollTrackerProps {
  ratio: number;
}

export const ScrollBackground = styled.div`
  position: relative;
  width: 100vw;
  height: 0.5rem;
  background: #005fee;
`;

export const ScrollTracker = styled.div<ScrollTrackerProps>`
  position: absolute;
  right: 0;
  width: ${(props) => props.ratio}%;
  height: 0.5rem;
  background: #f9f9f9;
`;

export const HeaderContents = styled.div`
  height: calc(100% - 0.5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
