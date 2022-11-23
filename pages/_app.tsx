import React, { Suspense, useEffect } from "react";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import styled from "styled-components";

import Loading from "../src/client/components/Loading";
import Header from "@components/Header";
import AppProvider from "@context/index";
import "./globals.css";

const setFirebase = () => {
  const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MSG_SENDER_ID,
    appId: process.env.FB_APP_ID,
    measurementId: process.env.FB_MEUSURE_ID
  };
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
}

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

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      setFirebase();
    }
  }, []);
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
