import React from "react";
import * as S from "./styles";

type SHeaderProps = {
  ratio: number;
};

function Header(Props: SHeaderProps) {
  return (
    <S.Header>
      <S.ScrollBackground>
        <S.ScrollTracker ratio={Props.ratio} />
      </S.ScrollBackground>
    </S.Header>
  );
}

export default Header;
