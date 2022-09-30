import React from "react";
import dynamic from "next/dynamic";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const Markdown = dynamic(async () => {
  const mod = await import("@uiw/react-markdown-preview");
  return mod.default;
}, { ssr: false });


const MarkdownViewer = (Props: { content: string }) => {
  return <>
    <div className="container">
      <Markdown source={Props.content} />
    </div>
  </>
}

export default MarkdownViewer;
