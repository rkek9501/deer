import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { BeatLoader } from "react-spinners";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

type MarkdownViewProps = {
  content: string;
};

const MarkdownFallback = (Props: MarkdownViewProps) => {
  return (
    <div style={{ textAlign: "center" }}>
      <BeatLoader color="#005fee" size={40} margin={10} />
      <pre style={{ visibility: "hidden" }}>{Props.content}</pre>
    </div>
  );
};

const MarkdownViewer = (Props: MarkdownViewProps) => {
  const Markdown = useMemo(
    () =>
      dynamic(
        async () => {
          const mod = await import("@uiw/react-markdown-preview");
          return mod.default;
        },
        {
          ssr: false,
          loading: () => <MarkdownFallback {...Props} />
        }
      ),
    []
  );

  return (
    <div className="container">
      <Markdown source={Props.content} />
    </div>
  );
};

export default MarkdownViewer;
