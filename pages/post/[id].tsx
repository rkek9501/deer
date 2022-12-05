import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import styled from "styled-components";

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

import RequestHelper from "@utils/requestHelper";
import { checkToken } from "@utils/tokenManager";
import { base64, utf8 } from "@utils/crypto";
import AdsComponents from "@components/Adsense";

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
  /* width: inherit; */
  height: fit-content;
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
  /* smartphones, iPhone, portrait 480x320 phones */
  @media (min-width: 1px) and (max-width: 480px) {
    padding: 0 2rem;
    /* width: calc(100% - 4rem); */
  }
  /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
  /* @media (min-width: 481px) {
    padding-left: 4rem;
    width: calc(100% - 4rem);
  } */
`;

type PostType = {
  title: string;
  content: string;
  user?: any;
  createdAt: string;
  tags?: any[];
};

const PostPage = (Props: any) => {
  console.log("page Props", Props);
  const [data, setData] = useState<PostType | null>(null);
  const [hData, setHData] = useState<any>([]);
  const [session, setSession] = useState(false);
  const [recomend, setRecomend] = useState(null);
  const router = useRouter();
  const contentId = router.query?.id;

  useEffect(() => {
    setSession(checkToken());
  }, []);

  useEffect(() => {
    if (!data) {
      (async () => {
        const { response: contentRes, error } = await RequestHelper.Get({ url: "/api/post/item/" + contentId });
        const { response: recomendRes } = await RequestHelper.Get({ url: "/api/post/recommend/" + contentId });
        console.log({ contentRes, recomendRes });
        setRecomend(recomendRes.data);
        
        const lines = contentRes.data?.content?.split("\n");
        const heading: any[] = [];
        const content = [];
        let isCodeBlock = false;
        for (const [idx, line] of lines.entries()) {
          if (line.indexOf("```") !== -1) {
            isCodeBlock = !isCodeBlock;
          }
          if (line.indexOf("# ") === 0 && !isCodeBlock) {
            content.push(`${line} <a id="bookmark_${idx}" class="bookmarked" style="visibility:hidden;"></a>`);
            heading.push({ type: "h1", line: line.slice(2), idx: `bookmark_${idx}` });
          } else if (line.indexOf("## ") === 0 && !isCodeBlock) {
            content.push(`${line} <a id="bookmark_${idx}" class="bookmarked" style="visibility:hidden;"></a>`);
            heading.push({ type: "h2", line: line.slice(3), idx: `bookmark_${idx}` });
          } else if (line.indexOf("### ") === 0 && !isCodeBlock) {
            content.push(`${line} <a id="bookmark_${idx}" class="bookmarked" style="visibility:hidden;"></a>`);
            heading.push({ type: "h3", line: line.slice(4), idx: `bookmark_${idx}` });
          } else {
            content.push(line);
          }
        }
        const contents = content.join("\n");
        setHData(heading);
        setData({ ...contentRes.data, content: contents });
      })()
    }
  }, [data]);

  const gotoEdit = () => {
    router.push({
      pathname: '/editor/[id]',
      query: { id: contentId },
    });
  };

  const goToTop = (e: React.MouseEvent<HTMLElement>) => {
    document.getElementById("scroller")?.scrollTo(0, 0);
    e.stopPropagation();
    e.preventDefault();
  };

  // return <div>404 Page Not Found</div> 
  
  // if(!data)
  return (<Layout>
    <PageContainer>
      <Helmet>
        <title>{`Deer | ${Props?.title}`}</title>

        <link rel="stylesheet" type="text/css" href="/css/index.css" />
        <link rel="stylesheet" type="text/css" href="/css/fonts.css" />
        <link rel="stylesheet" type="text/css" href="/css/prism.css" />
        <link rel="stylesheet" type="text/css" href="/css/editor.css" />
      </Helmet>
        {/* <link rel="stylesheet" href="css/prism.css" />
        <link rel="stylesheet" href="css/editor.css" /> */}
      {data ? (
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
            <BookMark data={hData} />
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
      ) : (
        <div className="center" id="center">
          게시글이 존재하지 않습니다.
        </div>
      )}
    </PageContainer>
  </Layout>);
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { response } = await RequestHelper.Get({ url: "/api/post/paths" });
  const paths = response.data?.map((post: any) => ({
    params: { id: `${post.subpath}` },
  }));
  return { paths, fallback: "blocking" }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageData = JSON.parse(utf8.decode(base64.decode(params?.id ? String(params?.id) : "")));
  const title = pageData.title;
  
  return {
    props: {
      title,
      // content: contentRes.data,
      // recomend: recomendRes.data,
      // error
    }
  }
}

export default PostPage;
