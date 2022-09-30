import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

const BookMarkConatiner = styled.div`
  right: 0;
  font-family: "score4";
  width: 200px;
  max-width: 200px;
  line-height: 24px;
  padding-left: 8px;
  @media (min-width: 1px) and (max-width: 480px) {
    display: none;
  }
  .fixed-box {
    border-left: solid 2px #d9d9d9;
    padding-left: 8px;
    position: fixed;
    width: 200px;
    max-width: 200px;
    font-size: 2rem;
    line-height: 2.4rem;
    word-break: break-all;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 40px 0;
    z-index: 1;
  }

  a {
    color: #a9a9a9;
    &.active {
      color: black;
    }
    text-decoration: none;
    font-size: 1.6rem;
    line-height: 1.8;
    &:hover {
      color: black;
    }
  }

  display: none;
  /* smartphones, iPhone, portrait 480x320 phones */
  @media (min-width: 1px) and (max-width: 480px) {
    display: none;
  }
  /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
  @media (min-width: 481px) {
    &.on {
      display: block;
    }
    &.off {
      display: none;
    }
  }
`;

const TableOfContents = ({ data }: { data: any }) => {
  const [visible, setVisible] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const ref = useRef(null);

  useLayoutEffect(() => {
    const end = document.getElementById("content-end");
    const scroller = document.getElementById("scroller");
    const onScroll = () => {
      const scrollTop = scroller?.scrollTop || 0;
      if (end?.offsetTop) {
        if (end?.offsetTop > scrollTop + 200) setVisible(true);
        else setVisible(false);
      }
    };
    scroller?.addEventListener("scroll", onScroll, false);
    return () => scroller?.removeEventListener("scroll", onScroll, false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );
    if (ref) {
      document.querySelectorAll(".toastui-editor-contents .bookmarked").forEach((section) => {
        console.log({ section });
        observer.observe(section);
      });
    }
    return () => {
      document.querySelectorAll(".toastui-editor-contents .bookmarked").forEach((section) => {
        console.log({ section });
        observer.unobserve(section);
      });
    };
  }, [ref]);

  return (
    <BookMarkConatiner className={visible ? "on" : "off"}>
      <div className="fixed-box" ref={ref}>
        {data.map((line: any, key: number) => {
          return (
            <a key={key} className={line.idx === activeId ? "active" : ""} href={`#${line.idx}`}>
              {line.type !== "h1" && (line.type === "h2" ? <>&ensp;</> : <>&emsp;</>)}
              {line.line}
            </a>
          );
        })}
      </div>
    </BookMarkConatiner>
  );
};

export default TableOfContents;
