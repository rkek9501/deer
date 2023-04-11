import React, { createContext, useState } from "react";

interface EditorProviderProps {
  children: React.ReactNode;
}

export type FileData = {
  src: string;
  name: string;
};

export const EditorContext = createContext({
  content: "",
  setContent: (file: string) => {}
});

const EditorProvider = (props: EditorProviderProps) => {
  const [content, setContent] = useState("");

  const values = {
    content,
    setContent
  };
  return <EditorContext.Provider value={values}>{props.children}</EditorContext.Provider>;
};

export default EditorProvider;
