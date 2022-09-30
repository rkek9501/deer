import React, { lazy, Suspense } from "react";
// import { getAnalytics } from "firebase/analytics";
// import { initializeApp } from "firebase/app";
import type { AppContext } from "next/app";
import styled from "styled-components";

import Loading from "../src/client/components/Loading";
import Header from "@components/Header";
import AppProvider from "@context/index";
import "./globals.css";

// if (process.env.NODE_ENV === "production") {
//   const firebaseConfig = {
//     apiKey: process.env.FB_API_KEY,
//     authDomain: process.env.FB_AUTH_DOMAIN,
//     projectId: process.env.FB_PROJECT_ID,
//     storageBucket: process.env.FB_STORAGE_BUCKET,
//     messagingSenderId: process.env.FB_MSG_SENDER_ID,
//     appId: process.env.FB_APP_ID,
//     measurementId: process.env.FB_MEUSURE_ID
//   };
//   const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
// }

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 70px);
  overflow: hidden;
  @media (min-width: 1px) and (max-width: 480px) {
    height: calc(100vh - 60px);
  }
`;

if (process.env.LOG_MODE === "off") {
  console.log = () => {};
}

const App = (appProps: any) => {
  const { Component, pageProps } = appProps;
  return (
    <Suspense fallback={<Loading />}>
      <AppProvider>
        <Header />
        <Container>
          <Component {...pageProps} />
        </Container>
      </AppProvider>
    </Suspense>
  );
}

export default App;
