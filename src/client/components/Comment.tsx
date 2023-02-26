import React, { useLayoutEffect, useRef } from "react";
import styled from "styled-components";

const attributes = {
  src: "https://utteranc.es/client.js",
  repo: process.env.COMMENT_REPO || "",
  theme: "github-light",
  "issue-term": "title",
  label: process.env.COMMENT_LABEL || "",
  crossOrigin: "anonymous",
  async: "true"
};

const CommentArea = styled.div`
  max-height: 250px;
  width: 100%;
  @media (min-width: 481px) {
    width: calc(100% - 200px);
  }
`;

const Comment = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current?.children.length === 0) {
      const utterances = document.createElement("script");
      Object.entries(attributes).forEach(([key, value]) => {
        utterances.setAttribute(key, value);
      });
      containerRef.current!.appendChild(utterances);
    }
  }, []);

  if (!process.env.COMMENT_REPO && !process.env.COMMENT_LABEL) {
    return null;
  }
  return <CommentArea ref={containerRef} />;
});

export default Comment;
