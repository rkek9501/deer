import React from "react";
import { useRouter } from "next/router";
import Masonry from "react-masonry-css";
import styled from "styled-components";

import { useCreateLink } from "@utils/useHooks";
import Card from "./Card";

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: auto;
  align-items: center;
  .empty-data {
    margin: 2rem;
    height: 100%;
  }
  .result-header {
    display: flex;
    width: 100%;
    margin-top: 8rem;
    margin-bottom: 2.2rem;
    &.header-row {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
    &.header-col {
      flex-direction: column;
      /* justify-content: space-between; */
      align-items: flex-start;
    }
    .result-count {
      font-family: "score4";
      font-size: 1.4rem;
    }
    .article {
      font-size: 2rem;
      font-family: Helvetica-Bold;
    }
  }
  .my-masonry-grid {
    width: 1560px !important;
    min-width: 1560px !important;
    max-width: 1560px !important;
    @media screen and (max-width: 1810px) {
      width: 1250px !important;
      min-width: 1250px !important;
      max-width: 1250px !important;
    }
    @media screen and (max-width: 1500px) {
      width: 940px !important;
      min-width: 940px !important;
      max-width: 940px !important;
    }
    @media screen and (max-width: 1190px) {
      width: 630px !important;
      min-width: 630px !important;
      max-width: 630px !important;
    }
    @media screen and (max-width: 880px) {
      width: 320px !important;
      min-width: 320px !important;
      max-width: 320px !important;
    }
    @media screen and (max-width: 480px) {
      width: calc(100% - 40px) !important;
      min-width: calc(100% - 40px) !important;
      max-width: calc(100% - 40px) !important;
    }
  }
`;

const breakpointColumnsObj = {
  default: 5,
  1810: 4,
  1500: 3,
  1190: 2,
  880: 1
};

const MasonryView = ({ data }: { data: any[] }) => {
  return (
    <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
      {data.map((post: any, id: number) => (
        <Card key={id} post={post} />
      ))}
    </Masonry>
  );
};

const SearchResult = (props: { posts: any }) => {
  const router = useRouter();
  const location = router.query;

  // const parsed = queryString.parse(router?..);
  const parsed = { search: false };

  useCreateLink("/css/masonry.css");

  if (!parsed.search) {
    return (
      <SearchContainer>
        <div className="result-header header-row my-masonry-grid">
          <div className="article">ATICLE</div>
        </div>
        <div className="date-filter"></div>
        <MasonryView data={props.posts} />
      </SearchContainer>
    );
  } else {
    const filtered: any = props.posts.filter((elem: any) => {
      const tagSearched = elem.tags.filter((tag: any) => tag.name === parsed.search).length !== 0;
      return elem.title.indexOf(parsed.search) !== -1 || tagSearched;
    });
    return (
      <SearchContainer>
        <div className="result-header header-col my-masonry-grid">
          <div className="article">&apos;{parsed.search}&apos; 검색결과</div>
          <div className="result-count">
            총 <b>{filtered.length}개</b>의 글이 있습니다.
          </div>
        </div>
        {filtered.length === 0 ? <div className="empty-data">해당내용의 게시글이 존재하지 않습니다.</div> : <MasonryView data={filtered} />}
      </SearchContainer>
    );
  }
};

export default SearchResult;
