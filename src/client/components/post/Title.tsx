import styled from "styled-components";

const TitleStyle = styled.h1`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  width: 100%;
  padding: 2rem 0;
  font-size: 9rem;
  font-weight: bold;
  font-family: score6;
  line-height: 9rem;
  margin: 0;
  word-break: keep-all;
  color: #333333;
  @media (min-width: 1px) and (max-width: 480px) {
    font-size: 40px;
    line-height: 48px;
  }
`;

export default TitleStyle;
