import { AppContext } from "@context/index";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Icons from "./Icons";
import Tag from "./TagBlock";

const SideContainer = styled.div`
  height: calc(var(--vh, 1vh) * 100 - 70px);
  @media (min-width: 1px) and (max-width: 480px) {
    height: auto !important;
    width: 100%;
    .tag-list {
      height: auto !important;
      width: 100%;
    }
  }
  width: 250px;
  min-width: 250px;
  display: block;
  font-weight: bold;
  text-align: left;
  background-color: white;
  .search-box {
    margin: 5rem 2rem 0 2rem;
  }
  .tag-list {
    display: block;
    padding: 0 2rem;
    &.tag-open {
      height: auto;
      overflow: unset;
    }
    &.tag-close {
      height: 25rem;
      overflow: scroll;
    }
  }
  .search {
    margin-bottom: 2rem;
    font-size: 2rem;
    font-family: Helvetica-Bold;
  }
  .input-box {
    display: flex;
    flex-direction: row;
    margin-bottom: 2.5rem;
    input {
      border: solid 2px black;
      width: 100%;
      height: 32px;
      font-size: 1.6rem;
      outline: none;
      border-radius: 0;
      -webkit-appearance: none;
      -webkit-border-radius: 0;
    }
    button {
      outline: none;
      background-color: transparent;
      border: solid 2px black;
      border-left: 0;
      display: flex;
      height: 32px;
      width: 32px;
      padding: 0;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: black;
      }
    }
  }
  .add-btn {
    margin-left: 2rem;
    background-color: transparent;
    outline: none;
    border: none;
    display: flex;
    padding: 0;
    align-items: center;
    justify-content: center;
  }
  display: block;
`;

const Menu = (Props: { onClick?: () => void }) => {
  const { tags, isMobile } = useContext(AppContext);
  const [value, setValue] = useState("");
  const [tagOpen, setTagOpen] = useState(false);
  const router = useRouter();
  const tagListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue("");
  }, [router.pathname]);

  const onClickSearch = () => {
    if (value === "") {
      alert("키워드를 입력해 주세요!");
    } else {
      router.push("/?search=" + value);
      Props.onClick?.();
    }
  };

  const onChangeInput = (value: any) => {
    setValue(value);
  };
  const onClickTag = (value: string) => {
    router.push("/?search=" + value);
  };

  const onKeyPressEnter = (key: string) => {
    if (key.toLowerCase() === "enter") {
      onClickSearch();
    }
  };

  useEffect(() => {
    const target = tagListRef.current;
    if (target && tags.length > 0) {
      const scrollHeight = target?.scrollHeight || 0;

      if ((!isMobile && scrollHeight > 250) || (isMobile && scrollHeight > 200)) {
        document.getElementById("tagg-open-btn")?.setAttribute("style", "display: block;");
      } else {
        document.getElementById("tagg-open-btn")?.setAttribute("style", "display: none;");
      }
    }
  }, [tagListRef, isMobile, tags]);

  return (
    <SideContainer>
      <div className="search-box">
        <div className="search">SEARCH</div>
        <div className="input-box">
          <input
            value={value}
            aria-label="Search"
            onChange={(e) => onChangeInput(e.target.value)}
            onKeyPress={(e) => onKeyPressEnter(e.key)}
          />
          <button type="button" onClick={() => onClickSearch()} name="search">
            <Icons.Search />
          </button>
        </div>
      </div>
      <div ref={tagListRef} className={`tag-list ${tagOpen ? "tag-open" : "tag-close"}`}>
        {tags?.map((tag: any, idx: number) => (
          <Tag
            key={idx}
            name={tag.name}
            color={tag.color}
            onClick={() => {
              onClickTag(tag.name);
              Props.onClick?.();
            }}
            alwaysOn={isMobile}
          />
        ))}
      </div>
      <button id="tagg-open-btn" type="button" className="add-btn" onClick={() => setTagOpen(!tagOpen)} name="expand">
        <Icons.AddBox />
      </button>
    </SideContainer>
  );
};

export default Menu;
