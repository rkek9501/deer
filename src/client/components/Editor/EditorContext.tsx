import React, { createContext, useState } from "react";

interface EditorProviderProps {
  children: React.ReactNode;
}

export type FileData = {
  src: string;
  name: string;
};

export const EditorContext = createContext({
  files: [] as FileData[],
  setFiles: (file: FileData[]) => {}
});

const EditorProvider = (props: EditorProviderProps) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const values = {
    files,
    setFiles
  };
  return <EditorContext.Provider value={values}>{props.children}</EditorContext.Provider>;
};

export default EditorProvider;
