import React, { Suspense, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Script from "next/script";
// import ReactGA from "react-ga";

import Loading from "@components/Loading";
import Header from "@components/Header";
import AppProvider from "@context/index";
import * as gtag from "@utils/gtag";
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
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = (url: any) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", onRouteChange);
    router.events.on("hashChangeComplete", onRouteChange);
    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
      router.events.off("hashChangeComplete", onRouteChange);
    };
  }, [router.events]);

  // useEffect(()=>{
  //   if (process.env.NODE_ENV === "production") {
  //     ReactGA.initialize(process.env.FB_STREAM_GID || "");
  //     ReactGA.pageview(location.pathname + location.pathname);
  //   }
  // },[]);

  return (
    <Suspense fallback={<Loading />}>
      <AppProvider>
        <script
          id="adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtag.FB_STREAM_GID}`} />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.FB_STREAM_GID}', {
            page_path: window.location.pathname,
          });
        `
          }}
        />
        <Header />
        <Container>
          <Component {...pageProps} />
        </Container>
      </AppProvider>
    </Suspense>
  );
};

export default App;
