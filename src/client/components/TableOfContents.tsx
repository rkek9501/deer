import React, { useEffect, useState } from "react";
import styled from "styled-components";

const BookMarkConatiner = styled.div`
  position: absolute;
  right: 0;
  font-family: "score4";
  width: calc((100vw - 756px) / 2);
  max-height: calc(var(--vh, 1vh) * 100 - 60px);
  max-width: calc((100vw - 756px) / 2);
  line-height: 24px;
  padding-left: 8px;
  .fixed-box {
    overflow: scroll;
    max-height: calc(var(--vh, 1vh) * 100 - 250px);
    border-left: solid 2px #d9d9d9;
    padding-left: 8px;
    position: fixed;
    width: calc((100vw - 756px) / 2);
    max-width: calc((100vw - 756px) / 2);
    font-size: 2rem;
    line-height: 2.4rem;
    word-break: break-all;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 40px;
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
  @media (min-width: 1px) and (max-width: 1140px) {
    display: none;
  }
  /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
  @media (min-width: 1141px) {
    &.on {
      display: block;
    }
    &.off {
      display: none;
    }
  }
`;

const useTableOfContents = () => {
  const [visible, setVisible] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    setTimeout(() => {
      document.querySelectorAll(".wmde-markdown h1").forEach((section) => {
        observer.observe(section);
      });
      setLoading(false);
    }, 1200);
    return () => {
      document.querySelectorAll(".wmde-markdown h1").forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return {
    visible,
    activeId,
    loading
  };
};

const TableOfContents = ({ data }: { data: any }) => {
  const { visible, activeId, loading } = useTableOfContents();

  return (
    <BookMarkConatiner className={visible ? "on" : "off"}>
      <div className="fixed-box">
        {loading
          ? null
          : data.map((line: any, key: number) => (
              <a key={key} className={line.idx === activeId ? "active" : ""} href={`#${line.idx}`}>
                {line.type !== "h1" && (line.type === "h2" ? <>&ensp;</> : <>&emsp;</>)}
                {line.line}
              </a>
            ))}
      </div>
    </BookMarkConatiner>
  );
};

export default TableOfContents;
