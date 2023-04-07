import React from "react";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";

import Head from "@components/HtmlHead";
import Layout from "@components/Layout";
import SearchResult from "@components/SearchResult";
import RequestHelper from "@utils/requestHelper";

const Home = (Props: any) => {
  return (
    <>
      <Head withMeta isHome={true} title="Deer" />
      <Layout>
        <SearchResult posts={Props.contents || []} />
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const contents = [];
  try {
    const cookie = context.req ? context.req.headers.cookie : "";
    const { response } = await RequestHelper.Get({ url: "/api/post/list" }, cookie);
    if (response?.result) {
      contents.push(...response?.data);
    }
  } catch (error) {
    console.log("Cannot Find Contents", error);
  }

  return {
    props: { contents }
  };
};

export default Home;
