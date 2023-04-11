import React, { Suspense, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Script from "next/script";
// import ReactGA from "react-ga";

import Loading from "@components/Loading";
import Header from "@components/Header";
import { SvgDefs } from "@components/Icons";
import AppProvider from "@context/index";
import * as gtag from "@utils/gtag";
import "./globals.css";

const Container = styled.div`
  width: 100vw;
  height: calc(var(--vh, 1vh) * 100 - 70px) !important;
  overflow: hidden;
  @media (min-width: 1px) and (max-width: 480px) {
    height: calc(var(--vh, 1vh) * 100 - 60px) !important;
  }
`;

const AbsScriptUrl = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
const TagScriptUrl = "https://www.googletagmanager.com/gtag/js";
const gtagScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gtag.FB_STREAM_GID}', {
  page_path: window.location.pathname,
});
`;

const ProdScripts = () => {
  return (
    <>
      <Script id="adsense" async src={`${AbsScriptUrl}?client=${process.env.ADSENSE_CLIENT}`} crossOrigin="anonymous" />
      <Script strategy="afterInteractive" src={`${TagScriptUrl}?id=${gtag.FB_STREAM_GID}`} />
      <Script id="gtag-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: gtagScript }} />
    </>
  );
};

const App = (appProps: any) => {
  const { Component, pageProps } = appProps;
  const router = useRouter();

  useEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
    window.addEventListener("resize", function () {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", vh + "px");
    });
  }, []);

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

  const isProd = useMemo(() => process.env.NODE_ENV === "production", []);

  return (
    <Suspense fallback={<Loading />}>
      <AppProvider>
        {isProd && <ProdScripts />}
        <Header />
        <Container>
          <Component {...pageProps} />
        </Container>
      </AppProvider>
      <SvgDefs />
    </Suspense>
  );
};

export default App;
