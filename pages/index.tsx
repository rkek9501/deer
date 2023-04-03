/* eslint-disable @next/next/no-css-tags */
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import dynamic from "next/dynamic";

import Layout from "@components/Layout";
import RequestHelper from "@utils/requestHelper";

const SearchResult = dynamic(() => import("@components/SearchResult"), { ssr: true });

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

export const getServerSideProps = async (context: any) => {
  const { response, error } = await RequestHelper.Get({ url: "/api/post/list" });
  return {
    props: {
      contentList: response?.data
    }
  };
};

export default Home;
