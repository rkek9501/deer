import React, { Suspense, useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import EditorProvider, { EditorContext } from "@components/Editor/EditorContext";
import MarkdownEditor from "@components/Editor";
import Head from "@components/HtmlHead";
import Loading from "@components/Loading";
import Switch from "@components/Switch";
import TagSelector from "@components/TagSelector";
import RequestHelper from "@utils/requestHelper";
import { AppContext } from "@context";
import type { TagType } from ".";

const EditMode = styled.div`
  font-size: 2.6rem;
  font-weight: bold;
  hr {
    border: solid 1px lightgrey;
  }
  .page-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .preview-switch-container {
      display: flex;
      align-items: center;
    }
  }
`;
const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: calc(var(--vh, 1vh) * 100 - 70px);
  @media (min-width: 1px) and (max-width: 480px) {
    height: calc(var(--vh, 1vh) * 100 - 60px);
  }
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: inherit;
  justify-content: center;
  align-items: flex-start;
  overflow: scroll;
  font-family: score5;
  border-right: ${(props) => (props.id === "left-container" ? "solid 0.5px black" : "none")};
  .center {
    margin: 3rem 0;
    width: 90%;
  }
`;
const TitleStyle = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  padding: 1rem 0 0;
  input {
    font-size: 2rem;
    border: 2px solid;
    padding: 0.4rem 0.8rem;
  }
`;
const Label = styled.label`
  font-size: 1.6rem;
  font-weight: bold;
`;
const Button = styled.button`
  min-width: 80px;
  padding: 1rem;
  border-radius: 10px;
  border: none;
  margin: 1rem 0;
  background-color: rgba(105, 230, 80, 1);
  cursor: pointer;
  :active {
    background-color: rgba(105, 230, 80, 0.8);
  }
`;
const Between = styled.div`
  display: flex;
  justify-content: space-between;
`;

type TitleType = {
  title: string;
  setTitle: (evnet: any) => void;
};
const TitleInput = (props: TitleType) => {
  return (
    <TitleStyle>
      <input value={props.title} onChange={(e) => props.setTitle(e.target.value)} />
    </TitleStyle>
  );
};

const EditorPage = (Props: any) => {
  const { tags: allTags, setLoading } = useContext(AppContext);
  const { content, setContent } = useContext(EditorContext);
  const router = useRouter();
  const contentId = router.query?.id || null;
  const editMode = !!contentId;

  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [openState, setOpenState] = useState(false);
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedTags, setSelectedTags] = useState([]);
  // const [writter, setWritter] = useState(localStorage?.getItem("name") || "");

  useEffect(() => {
    if (contentId)
      (async () => {
        const { response, error } = await RequestHelper.Get({ url: "/api/post/item/" + contentId });
        if (response?.data) {
          setId(response.data?.id);
          setTitle(response.data?.title);
          setOpenState(response.data?.openState === "Y");
          setContent(response.data?.content);
          setSelectedTags(
            response.data?.tags?.map((tag: any) => ({
              value: tag.id,
              label: tag.name,
              color: tag.color
            }))
          );
          // setWritter(response.data?.writterId);
        }
        setLoading(false);
        if (error) {
          router.push("/404");
        }
      })();
  }, [contentId]);

  useEffect(() => {
    if (allTags && allTags.length > 0) {
      // console.log({ allTags });
      const tagList: TagType[] =
        allTags?.map((tag: any) => {
          return { label: tag.name, value: tag.id, color: tag.color };
        }) ?? [];

      // console.log({ tagList });
      setTags(tagList as TagType[]);
    }
  }, [allTags]);

  const uploadPost = useCallback(async () => {
    const params = {
      id,
      title,
      content,
      openState: openState ? "Y" : "N",
      tagList: selectedTags.map((tag: any) => ({
        id: tag.__isNew__ ? null : tag.value,
        name: tag.label,
        color: tag.color
      }))
    };
    const { response, error } = await RequestHelper.Put({
      url: "/api/post/update",
      body: params
    });
    if (error) {
      return alert("오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
    }
    alert(response.message);
    if (response.result) {
      return router.push("/post/" + contentId);
    }
  }, [id, title, content, openState, selectedTags]);

  return (
    <>
      <Head isMarkdown title="Deer - 게시글 수정" />
      <Suspense fallback={<Loading />}>
        
          <PageContainer>
            <Container id="left-container">
              <div className="center">
                <EditMode>
                  <div className="page-title">
                    게시글&nbsp;{editMode ? "수정" : "작성"}
                  </div>
                  <hr />
                </EditMode>

                <br />
                <Label>제목</Label>
                <TitleInput title={title} setTitle={setTitle} />

                <br />
                <Label>본문</Label>
                <MarkdownEditor />

                <br />
                <Label>태그 선택</Label>
                <TagSelector options={tags} selected={selectedTags} setSelected={setSelectedTags} />

                <br />
                <Between>
                  <div>
                    <Label>공개 여부</Label>
                    <Switch trueText="공개" falseText="비공개" checked={openState} setChecked={setOpenState} />
                  </div>

                  <Button onClick={() => uploadPost()}>{editMode ? "수정" : "작성"}</Button>
                </Between>
              </div>
            </Container>
          </PageContainer>
      </Suspense>
    </>
  );
};

const ThisPage = () => <EditorProvider><EditorPage /></EditorProvider>;

export default ThisPage;
