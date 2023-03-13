import React, { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { BlockPicker, ColorResult } from "react-color";

import { AppContext } from "@context";
import Button from "@components/Button";
import Tag from "@components/TagBlock";
import TagList from "@components/post/TagList";
import { DefaultColors } from "@utils";
import Icons from "@components/Icons";

type TagType = {
  id?: number;
  name: string;
  color: string;
}

const TagListContainer = styled.div`
  padding: 20px 30px;
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  button {
    width: 60px;
  }
`;
const FormContainer = styled.div`
  width: 60%;
  max-width: 240px;
  padding: 20px 0;
  @media (min-width: 1px) and (max-width: 480px) {
    width: 100%;
    max-width: 100%;
  }
  .tag-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .input-form-container {
    max-width: 240px;
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    margin: 10px 0;
    label {
      width: 60px;
      max-width: 60px;
      text-align: center;
      font-weight: bold;
    }
    input {
      width: 170px;
      max-width: 170px;
      flex: 1;
      padding: 8px;
      border-radius: 2px;
      border: solid 0.4px black;
      box-shadow: 4px 4px 4px lightgray;
    }
  }
  .color-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: solid 0.4px black;
    overflow: hidden;
    box-shadow: 4px 4px 4px lightgray;
  }
  .btns-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    font-size: 1.4rem;
    padding: 20px 0;
    *:nth-child(1) {
      margin-right: 10px;
    }
  }
`;

const TagManage = ({
  tagList,
  onClickTag,
}: {
  tagList: TagType[];
  onClickTag: (tag: TagType) => void;
}) => {
  return (
    <Wrapper>
      <TagList>
        {tagList.map((tag: any, idx: number) => <Tag
          key={idx}
          {...tag}
          alwaysOn={true}
          onClick={() => {
            onClickTag(tag);
          }}
        />)}
      </TagList>
    </Wrapper>
  );
};

const TagModify = ({
  tag,
  mode,
  onClickComplete,
  onClickCancel
}: {
  tag: TagType | null;
  mode: "add" | "modify";
  onClickComplete: (tag: TagType) => void;
  onClickCancel: () => void;
}) => {
  const [name, setName] = useState(tag?.name || "");
  const [color, setColor] = useState(tag?.color || DefaultColors[0]);

  const handleColor = useCallback((color: ColorResult) => {
    setColor(color.hex);
  }, []);

  return (
    <Wrapper>
      <FormContainer>
        <div className="tag-center">
          <Tag name={name} color={color} alwaysOn={true} />
        </div>

        <span className="input-form-container">
          <label htmlFor="tag-name-input">이름</label>
          <input
            id="tag-name-input"
            type="text"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
        </span>
        <span className="input-form-container">
          <label htmlFor="tag-color-input">색</label>
          <div className="color-container">
            <BlockPicker
              triangle="hide"
              color={color}
              colors={DefaultColors}
              onChangeComplete={handleColor}
            />
          </div>
        </span>

        <span className="btns-container">
          <Button onClick={onClickCancel}>취소</Button>
          <Button onClick={() => onClickComplete({ name, color })}>
            {mode === "add" ? "추가" : "수정"}
          </Button>
        </span>
      </FormContainer>
    </Wrapper>
  );
};

const useTag = () => {
  const { setLoading } = useContext(AppContext);
  const [mode, setMode] = useState<"list"|"add"|"modify">("list");
  const [selectedTag, setSelectedTag] = useState<TagType|null>(null);

  const onClickCancel = () => {
    setMode("list");
    setSelectedTag(null);
  };
  const onClickAdd = () => {
    setMode("add");
    setSelectedTag(null);
  };
  const onClickModify = (tag: TagType) => {
    setMode("modify");
    setSelectedTag(tag);
  };
  const onClickComplete = useCallback((tag: TagType) => {
    if (!tag.name || tag.name.trim().length === 0) {
      return alert("태그 이름을 입력해주세요.");
    }
    if (!tag.color || tag.color.trim().length === 0) {
      return alert("태그 색을 선택해주세요.");
    }
    if (selectedTag?.name === tag.name && selectedTag?.color === tag.color) {
      return alert("수정된 값이 없습니다.");
    }
    setLoading(true);

    // TODO: api 추가 후 연동
    if (mode === "add") {
      console.log({tag});
    } else if (mode === "modify") {
      console.log(selectedTag?.id, {tag});
    }

    setTimeout(() => {
      setLoading(false);
      onClickCancel();
    }, 1000)
  }, [mode, selectedTag]);
  return {
    mode,
    selectedTag,
    onClickCancel,
    onClickAdd,
    onClickModify,
    onClickComplete
  };
};

const Mode = {
  list: "관리",
  add: "추가",
  modify: "수정"
};

const TagPage = () => {
  const { tags: allTags } = useContext(AppContext);
  const {
    mode,
    selectedTag,
    onClickCancel,
    onClickAdd,
    onClickModify,
    onClickComplete
  } = useTag();
  
  return (
    <TagListContainer>
      <Title>
        <h1>태그 {Mode[mode]}</h1>
        {mode==="list"
          ? <div onClick={onClickAdd}><Icons.Plus/></div>
          : <div onClick={onClickCancel}><Icons.Close/></div>
        }
      </Title>
      <hr/>
      {mode==="list"
        ? <TagManage
          tagList={allTags}
          onClickTag={onClickModify}
        />
        : <TagModify
          mode={mode}
          tag={selectedTag}
          onClickCancel={onClickCancel}
          onClickComplete={onClickComplete}
        />
      }
    </TagListContainer>
  );
};

export default TagPage;
