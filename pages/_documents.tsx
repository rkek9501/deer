import React from "react";

import Document, { Head, Html, Main, NextScript } from "next/document";

import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  public render() {
    console.log("run _documents")
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <meta name="description" content="Trident" />
          <title>Trident</title>

          <link rel="shortcut icon" href="/img/favi/favicon.ico" />
          <link rel="apple-touch-icon" sizes="57x57" href="/img/favi/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/img/favi/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/img/favi/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/img/favi/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/img/favi/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/img/favi/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/img/favi/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/img/favi/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/img/favi/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/img/favi/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/img/favi/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/img/favi/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/img/favi/favicon-16x16.png" />
          <link rel="manifest" href="/img/favi/manifest.json" />

          <link rel="stylesheet" href="css/fonts.css" />
          <link rel="stylesheet" href="css/index.css" />
          <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
          {/* <script
            defer
            src="https://code.jquery.com/jquery-3.6.0.min.js"
            integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
            crossOrigin="anonymous"
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

Document.getInitialProps = async (ctx) => {
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      )
    };
  } finally {
    sheet.seal();
  }
};

export default MyDocument;
