import React, { ChangeEvent, useCallback, useContext, useMemo, useRef } from "react";
import dynamic from "next/dynamic";

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

import Icons from "@components/Icons";
import requestHelper from "@utils/requestHelper";
import { EditorContext } from "./EditorContext";

const EditorUploader = () => {
  const { setContent } = useContext(EditorContext);
  const ref = useRef<HTMLInputElement>(null);

  const imageUpload = useCallback(async (file: any) => {
    const response = await requestHelper.Upload(file, "content");

    const url = "/uploads/" + response.file;
    const imgTag = `<img src="${url}" style="width: 100%;" />`;
    const insertedMarkdown = insertToTextArea(imgTag);

    if (!insertedMarkdown) return;
    setContent(insertedMarkdown);
    
    return "/uploads/" + response.file;
  }, []);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.[0]) imageUpload(e.target.files[0]);
  }, []);

  return (
    <div style={{ width: "fitContent", padding: 10 }}>
      <div>이미지 파일 업로드</div>
      <button onClick={() => ref.current?.click()} >
        파일선택
      </button>
      <input type="file" ref={ref} style={{ display: "none" }} onChange={handleFileChange} />
    </div>
  );
};


const imageUploader = group([], {
  name: "image",
  groupName: "image",
  icon: <Icons.Upload />,
  buttonProps: { "aria-label": "Upload & Insert image" },
  children: (props) => <EditorUploader />,
});

const insertToTextArea = (intsertString: string) => {
  const textarea: HTMLTextAreaElement | null = document.querySelector("textarea.w-md-editor-text-input");
  if (!textarea) return null;

  let sentence = textarea.value;
  const len = sentence.length;
  const pos = textarea.selectionStart;
  // const end = textarea.selectionEnd;

  const front = sentence.slice(0, pos);
  const back = sentence.slice(pos, len);

  sentence = front + intsertString + back;

  // textarea.value = sentence;
  // textarea.selectionEnd = end + intsertString.length;

  return sentence;
};

const MarkdownEditor = () => {
  const { content, setContent } = useContext(EditorContext);
  const MDEditor = useMemo(
    () =>
      dynamic<MDEditorProps>(
        async () => {
          const mod = await import("@uiw/react-md-editor");

          return mod.default;
        },
        { ssr: false }
      ),
    []
  );

  return (
    <>
      <div className="container">
        <MDEditor
          value={content}
          minHeight={300}
          height={500}
          onChange={(value: any, ...args) => {
            setContent(value);
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
            imageUploader
          ]}
        />
      </div>
    </>
  );
};

export default MarkdownEditor;
