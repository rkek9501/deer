import React, { useCallback, useContext, useRef } from "react";
import dynamic from "next/dynamic";
import clone from "lodash/clone";

import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import type { MDEditorProps } from "@uiw/react-md-editor";
import {
  group,
  bold,
  italic,
  strikethrough,
  hr,
  divider,
  title1,
  title2,
  title3,
  title4,
  title5,
  title6,
  link,
  quote,
  code,
  codeBlock,
  unorderedListCommand,
  orderedListCommand,
  checkedListCommand
} from "@uiw/react-md-editor/lib/commands";

import requestHelper from "@utils/requestHelper";
import Icons from "@components/Icons";
import { EditorContext, FileData } from "./EditorContext";

const MDEditor = dynamic<MDEditorProps>(
  async () => {
    const mod = await import("@uiw/react-md-editor");

    return mod.default;
  },
  { ssr: false }
);

const EditorUploader = (Props: { appendImg: (img: string) => void; close: () => void }) => {
  const { files, setFiles } = useContext(EditorContext);
  const ref = useRef<HTMLInputElement>(null);

  const appendNewFile = (file: FileData) => {
    const temp: FileData[] = clone(files);
    temp.push(file);
    setFiles(temp);
  };
  const imageUpload = useCallback(async (file: any) => {
    const response = await requestHelper.Upload(file, "content");
    appendNewFile({ name: response.file, src: "/uploads/" + response.file });
    Props.appendImg("/uploads/" + response.file);
    return "/uploads/" + response.file;
  }, []);
  return (
    <div style={{ width: "fitContent", padding: 10 }}>
      <div>이미지 파일 업로드</div>
      <button
        onClick={() => {
          ref.current?.click();
        }}
      >
        파일선택
      </button>
      <input
        type="file"
        ref={ref}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target?.files?.[0]) {
            imageUpload(e.target.files[0]);
            Props.close();
          }
        }}
      />
    </div>
  );
};

const MarkdownEditor = (Props: { content: string; setContent: (content: string) => void }) => {
  const appendImg = useCallback(
    async (img: string) => {
      const prev = Props.content;
      const imgTag = `<img src="${img}" style="width: 100%;" />`;
      Props.setContent(`${prev ? prev + "\n" : ""}${imgTag}`);
    },
    [Props.content]
  );

  return (
    <>
      <div className="container">
        <MDEditor
          value={Props.content || ""}
          height={300}
          onChange={(value: any, ...args) => {
            Props.setContent(value);
            console.log({ args, value });
          }}
          commands={[
            bold,
            italic,
            strikethrough,
            hr,
            divider,
            group([title1, title2, title3, title4, title5, title6], {
              name: "title",
              groupName: "title",
              buttonProps: { "aria-label": "Insert title" }
            }),
            link,
            quote,
            code,
            codeBlock,
            divider,
            unorderedListCommand,
            orderedListCommand,
            checkedListCommand,
            group([], {
              name: "update",
              groupName: "update",
              icon: <Icons.Upload />,
              buttonProps: { "aria-label": "Upload Image" },
              children: ({ close, execute, getState, textApi }) => {
                return <EditorUploader appendImg={appendImg} close={close} />;
              }
              // execute: (state, api)  => {
              //   console.log('execute', state, api);
              //   api.replaceSelection(selectedFile || "");
              // },
            })
          ]}
        />
      </div>
    </>
  );
};

export default MarkdownEditor;
