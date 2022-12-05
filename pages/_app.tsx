import React, { Suspense, useEffect } from "react";
import styled from "styled-components";
import ReactGA from "react-ga";

import Loading from "@components/Loading";
import Header from "@components/Header";
import AppProvider from "@context/index";
import "./globals.css";

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 70px);
  overflow: hidden;
  @media (min-width: 1px) and (max-width: 480px) {
    height: calc(100vh - 60px);
  }
`;

const App = (appProps: any) => {
  const { Component, pageProps } = appProps;

  useEffect(()=>{
    if (process.env.NODE_ENV === "production") {
      ReactGA.initialize(process.env.FB_STREAM_GID || "");
      ReactGA.pageview(location.pathname + location.pathname);
    }
  },[]);
  
  return (
    <Suspense fallback={<Loading />}>
      <AppProvider>
        <script
          id="adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
        <Header />
        <Container>
          <Component {...pageProps} />
        </Container>
      </AppProvider>
    </Suspense>
  );
}

export default App;
