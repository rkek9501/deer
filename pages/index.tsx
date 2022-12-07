import React, { useState } from "react";
import { Helmet } from "react-helmet";
import dynamic from "next/dynamic";

import Layout from "@components/Layout";
import RequestHelper from "@utils/requestHelper";

const SearchResult = dynamic(() => import("@components/SearchResult"), { ssr: false });

const Home = (Props: any) => {
  const [posts] = useState<any>(Props.contentList || []);

  return (
    <Layout>
      <Helmet>
        <title>Deer</title>
        <link rel="stylesheet" type="text/css" href="/css/index.css" />
        <link rel="stylesheet" type="text/css" href="/css/fonts.css" />
        <link rel="stylesheet" type="text/css" href="/css/home.css" />
        <link rel="stylesheet" type="text/css" href="/css/masonry.css" />
      </Helmet>
      <SearchResult posts={posts} />
    </Layout>
  );
};

Home.getInitialProps = async (context: any) => {
  const { ctx, Component } = context;
  console.log({ctx, Component});
  // const initialCookies = ctx.req?.headers.cookie;
  // if (initialCookies) ctx.res?.setHeader('Set-Cookie', initialCookies);

  // let pageProps = {};
  // const cookie = ctx?.req?.headers?.cookie || '';
  // console.log({cookie});
  // if (cookie) { 
  //   // Axios.defaults.headers.Cookie = cookie;
  // }
  // if (Component.getInitialProps) {
  //   pageProps = await Component.getInitialProps(ctx);
  // }

  const { response, error } = await RequestHelper.Get({ url: "/api/post/list" }, );
  return {
    contentList: response.data,
    // pageProps
  } 
}

export default Home;
