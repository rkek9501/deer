import React from "react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import styled, { css } from "styled-components";
import Tag from "./tag";

const CardContainer = styled.a`
  background-color: #f9f9f9;
  display: inline-block;
  width: 300px;
  /* width: ${(props: { small: boolean }) => (props.small ? "300px" : "360px")}; */
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-color: #555555;
  margin: 0;
  margin-bottom: 15px;
  cursor: pointer;
  .card-top {
    /* height: 200px; */
    width: auto;
    /* height: ${(props: { small: boolean }) => (props.small ? "200px" : "257px")};
    width: ${(props: { small: boolean }) => (props.small ? "300px" : "360px")}; */
    display: flex;
    position: relative;
    justify-content: flex-end;
    img.card-top-img {
      display: flex;
      width: 225px;
      object-fit: contain;
      min-height: 150px;
      margin-bottom: 0;
      position: relative;
    }
    .secret-card {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background-color: black;
      font-size: 2rem;
      opacity: 0.4;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      z-index: 2;
    }
    .title {
      position: absolute;
      z-index: 3;
      /* width: ${(props: { small: boolean }) => (props.small ? "260px" : "310px;")}; */
      /* width: ${(props: { small: boolean }) => (props.small ? "260px" : "310px;")}; */
      bottom: 0px;
      left: 0;
      margin: 0;
      margin-bottom: -1rem;
      color: #ffffff;
      font-size: 3rem;
      font-weight: 600;
      font-family: "score6";
      color: #c5c5c5;
      line-height: 3rem;
      .highlight {
        display: inline;
        background: #000000;
        color: #fff;
        padding: 0.2rem;
        word-wrap: break-word;
        word-break: keep-all;
        position: relative;
        left: 0.2rem;
        padding-left: 0;
        box-shadow: 2px 0 0 #000000, -2px 0 0 #000000;
      }
    }
  }
  .subtitle {
    margin-bottom: 0.8rem;
    font-family: score4;
    font-size: 1.6rem;
    justify-content: flex-end;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .card-bottom {
    display: flex;
    flex-direction: column;
    margin: 2rem 1rem 1rem;
    .data-area {
      margin: 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .date {
        margin: 0;
        font-size: 1.6rem;
      }
      .author {
        margin: 0;
        color: #295bc3;
        font-weight: bold;
        font-family: "score5";
        font-size: 1.6rem;
      }
    }
    .tag-area {
      margin: 2rem 0 0 0;
      display: flex;
      flex-flow: row wrap;
    }
  }
  /* smartphones, iPhone, portrait 480x320 phones */
  @media (min-width: 1px) and (max-width: 480px) {
    ${({ small }) =>
      !small &&
      css`
        width: 100% !important;
      `};
    /* min-width: 320px !important; */
    /* padding: 0 10px; */
    /* width: calc(100% - 20px); */
    .subtitle {
      display: none;
    }
    .card-top {
      img.card-top-img {
        width: 75%;
        object-fit: cover;
        height: 160px;
        margin-bottom: 0;
      }
    }
  }
`;

type File = {
  src: string;
  name: string;
};
type PostType = {
  id: number;
  title: string;
  subtitle: string;
  writterId: string;
  user: { name: string };
  tags?: [];
  subpath: string;
  onClick: any;
  files: File[];
  openState: string | "Y" | "N";
  createdAt: string;
};

const getThumb = (id: number) => {
  return (id % 4) + 1;
};
const CardImgLoader = ({ src }: { src: string }) => {
  return `${src}`
}
const Textcard = (props: { post: PostType; size?: string }) => {
  let firstImgSrc = props.post.files?.length > 0 ? props.post.files[0]?.src : null;
  if (!firstImgSrc) {
    firstImgSrc = `/img/card/default${getThumb(props.post.id)}.jpg`;
  }
  return <Link href={`/post/${props.post.subpath}`}>
    <CardContainer small={props.size === "small"} >
      <div className="card-top">
        <Image
          className={`card-top-img ${props.post.openState && "secret"}`}
          width={225}
          height={150}
          unoptimized={true} 
          layout={"fixed"}
          src={firstImgSrc}
          loader={CardImgLoader}
        />
        <h2 className="title">
          <span className="highlight">{props.post.title}</span>
        </h2>
        {props.post.openState !== "Y" && <div className="secret-card">비공개</div>}
      </div>

      <div className="card-bottom">
        <div className="subtitle">{props.post.subtitle}</div>

        <div className="data-area">
          <p className="date">{moment(props.post.createdAt).format("MMM DD, YYYY")}</p>
          <p className="author">{props.post?.user?.name}</p>
        </div>

        <div className="tag-area">
          {props.post.tags?.map((tag: { name: string; color: string }, idx: number) => {
            return <Tag key={idx} name={tag.name} color={tag.color} alwaysOn={true} />;
          })}
        </div>
      </div>
    </CardContainer>
  </Link>;
};

export default Textcard;
