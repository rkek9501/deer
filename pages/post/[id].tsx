import React from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import styled from "styled-components";

import AdsComponents from "@components/Adsense";
import { Viewer } from "@components/Editor";
import FloatingBtn from "@components/FloatingButton";
import Head from "@components/HtmlHead";
import Icons from "@components/Icons";
import Layout from "@components/Layout";
import TagList from "@components/post/TagList";
import Title from "@components/post/Title";
import UserView from "@components/post/UserView";
import BookMark from "@components/TableOfContents";
import Tag from "@components/TagBlock";

const Carousel = dynamic(() => import("@components/Carousel"), { ssr: false });
const Comment = dynamic(() => import("@components/Comment"), { ssr: false });

import useLoadPost from "@hooks/useLoadPost";
import RequestHelper from "@utils/requestHelper";
// import { base64, utf8 } from "@utils/crypto";

const PageContainer = styled.div`
  height: inherit;
  width: inherit;
  display: flex;
  justify-content: center;
  flex: 1;
  font-family: score5;
`;
const ContentContainer = styled.div`
  position: relative;
  height: fit-content;
  max-width: 756px;
  display: flex;
  flex: 1;
  flex-direction: column;
  font-family: score5;
  .content-main {
    width: inherit;
    display: flex;
    flex-direction: row;
  }
  .center {
    width: inherit;
    max-width: 756px;
    margin: 5rem 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    .container {
      padding: 0 2rem;
    }
    img {
      width: 100%;
    }
    @media (min-width: 481px) {
      width: calc(100vw - 450px);
    }
  }
  .slider-title {
    width: inherit;
    font-family: score5;
    font-style: normal;
    font-weight: 500;
    font-size: 2rem;
    line-height: 2.4rem;
    display: flex;
    align-items: center;
    color: #333333;
    @media (min-width: 1px) and (max-width: 480px) {
      font-size: 18px;
    }
  }

  padding: 0 2rem;
  width: 100%;
  @media (min-width: 1px) and (max-width: 480px) {
    padding: 0 2rem;
    max-width: 100vw;
    .center {
      max-width: 100vw;
    }
  }
`;

const PostPage = (Props: any) => {
  const { data, contentId } = Props;
  const { gotoEdit, goToTop, hData, session, recomend } = useLoadPost(data, contentId);

  return (
    <>
      <Head
        withMeta
        isMarkdown={true}
        title={`Deer${data?.title ? ` | ${data?.title}` : ""}`}
        description={data?.subtitle || null}
        url={`https://de-er.link/post/${contentId}`}
      />
      <Layout noneMenu={true}>
        <PageContainer>
          {data ? (
            <>
              <ContentContainer>
                <div className="content-main">
                  <div className="center">
                    <Title>{data?.title}</Title>
                    <UserView name={data.user?.name} image={data.user?.image} date={data.createdAt} />
                    <TagList>
                      {data.tags?.map((tag: { name: string; color: string }, idx: number) => {
                        return <Tag key={idx} name={tag.name} color={tag.color} alwaysOn={true} />;
                      })}
                    </TagList>
                    <Viewer content={data?.content} />
                  </div>
                </div>

                <span id="content-end" />
                <div style={{ position: "relative" }}>
                  <FloatingBtn bottom={80} bgColor="#F9F9F9" onClick={goToTop}>
                    <Icons.ToTop />
                  </FloatingBtn>
                  {session && (
                    <FloatingBtn bottom={20} bgColor="greenyellow" onClick={() => gotoEdit()}>
                      수정
                    </FloatingBtn>
                  )}
                </div>
                <Carousel contents={recomend || []} />
                <Comment />
              </ContentContainer>
              <BookMark data={hData} />
            </>
          ) : (
            <div className="center" id="center">
              게시글이 존재하지 않습니다.
            </div>
          )}
        </PageContainer>
      </Layout>
      <AdsComponents />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { response } = await RequestHelper.Get({ url: "/api/post/paths" });
  const paths = response.data?.map((post: any) => ({
    params: { id: `${post.subpath}` }
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (Props: any) => {
  const { params } = Props;

  let data = null;
  let id = "";
  try {
    id = params?.id ? String(params?.id) : "";
    const { response, error } = await RequestHelper.Get({ url: "/api/post/item/" + id });
    if (error) throw Error(error);
    if (response?.result) {
      data = { ...response?.data };
    }
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      contentId: id,
      data
    }
  };
};

// export const getServerSideProps = async ({ req, res }: any) => {
//   console.log("getServerSideProps!!!!!!!!!!!")
//   // res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

//   return {
//     props: {},
//   }
// }

export default PostPage;
