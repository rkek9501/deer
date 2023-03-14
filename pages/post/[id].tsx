import React from "react";
import { Helmet } from "react-helmet";
import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import styled from "styled-components";

import AdsComponents from "@components/Adsense";
import { Viewer } from "@components/Editor";
import FloatingBtn from "@components/FloatingButton";
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
import { base64, utf8 } from "@utils/crypto";

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
  const {
    gotoEdit,
    data,
    hData,
    session,
    recomend
  } = useLoadPost();

  const goToTop = (e: React.MouseEvent<HTMLElement>) => {
    document.getElementById("scroller")?.scrollTo(0, 0);
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Layout noneMenu={true}>
      <PageContainer>
        <Helmet>
          <title>{`Deer | ${Props?.title}`}</title>
          <link rel="stylesheet" type="text/css" href="/css/index.css" />
          <link rel="stylesheet" type="text/css" href="/css/fonts.css" />
          <link rel="stylesheet" type="text/css" href="/css/prism.css" />
          <link rel="stylesheet" type="text/css" href="/css/editor.css" />
        </Helmet>
        {data ? (<>
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
            <AdsComponents />
            <Comment />
          </ContentContainer>
          <BookMark data={hData} />
        </>) : (
          <div className="center" id="center">
            게시글이 존재하지 않습니다.
          </div>
        )}
      </PageContainer>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { response } = await RequestHelper.Get({ url: "/api/post/paths" });
  const paths = response.data?.map((post: any) => ({
    params: { id: `${post.subpath}` }
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageData = JSON.parse(utf8.decode(base64.decode(params?.id ? String(params?.id) : "")));
  const title = pageData.title;

  return {
    props: {
      title
      // content: contentRes.data,
      // recomend: recomendRes.data,
      // error
    }
  };
};

export default PostPage;
