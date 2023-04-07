import React from "react";
import styled from "styled-components";
import { BlockPicker } from "react-color";

import Button from "@components/Button";
import Tag from "@components/TagBlock";
import Icons from "@components/Icons";
import { DefaultColors } from "@utils";
import useTag, { TagPageMode, TagType, useTagEditor } from "@hooks/useTag";
import Head from "@components/HtmlHead";

const TagListContainer = styled.div`
  padding: 20px 30px;
  height: calc(100vh - 60px);
  overflow: scroll;
`;

const Wrapper = styled.div`
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

const TagManage = ({ tagList, onClickTag }: { tagList: TagType[]; onClickTag: (tag: TagType) => void }) => {
  return (
    <Wrapper>
      {tagList.map((tag: any, idx: number) => (
        <Tag
        key={idx}
        {...tag}
        alwaysOn={true}
        onClick={() => {
          onClickTag(tag);
        }}
        />
      ))}
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
  const { name, color, setName, handleColor } = useTagEditor({ name: tag?.name, color: tag?.color });

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

const TagPage = () => {
  const {
    allTags,
    mode,
    selectedTag,
    onClickCancel,
    onClickAdd,
    onClickModify,
    onClickComplete
  } = useTag();
  
  return (<>
    <Head title="Deer - 태그" />
    <TagListContainer>
      <Title>
        <h1>태그 {TagPageMode[mode]}</h1>
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
  </>);
};

export default TagPage;
