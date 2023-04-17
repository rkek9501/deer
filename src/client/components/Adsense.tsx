import React from "react";
import Script from "next/script";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100px;
  * {
    height: 100px;
    max-height: 100px;
  }
`;

const AdsComponents = (Props: { isRelative?: boolean; }) => {
  return (
    <Container style={{ maxHeight: "100px", position: Props.isRelative ? "relative" : "absolute" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", maxHeight: "100px" }}
        data-ad-client={process.env.ADSENSE_CLIENT}
        data-ad-slot={process.env.ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script
        id="adsense-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }}
      />
    </Container>
  );
};

export default AdsComponents;
