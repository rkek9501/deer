import { useCallback, useContext, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { AppContext } from "@context";
import { getFetcher, postFetcher, putFetcher } from "@utils/swrFetcher";
import { DefaultColors } from "@utils";
import type { ColorResult } from "react-color";

export type TagType = {
  id?: number;
  name: string;
  color: string;
}

export const TagPageMode = {
  list: "관리",
  add: "추가",
  modify: "수정"
};


const useTag = () => {
  const { setLoading } = useContext(AppContext);
  const [mode, setMode] = useState<"list"|"add"|"modify">("list");
  const [selectedTag, setSelectedTag] = useState<TagType|null>(null);
  const { data, isLoading, error, mutate } = useSWR("/api/tag?option=all", getFetcher);

  const { trigger: createTag } = useSWRMutation("/api/tag", postFetcher);
  const { trigger: updateTag  } = useSWRMutation("/api/tag", putFetcher);

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
  const onClickComplete = useCallback(async (tag: TagType) => {
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

    try {
      if (mode === "add") {
        console.log({tag});
        const response = await createTag({ name: tag.name, color: tag.color });
        // console.log({ result });
        if (response.result) {
          mutate();
        } else {
          alert(response?.message || "태그 생성 중 오류가 발생했습니다.")
        }
      } else if (mode === "modify") {
        const response = await updateTag({ id: selectedTag?.id, name: tag.name, color: tag.color });
        if (response.result) {
          mutate();
        } else {
         alert(response?.message || "태그 수정 중 오류가 발생했습니다.")
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      onClickCancel();
    }
  }, [mode, selectedTag]);

  return {
    allTags: data?.data || [],
    isLoading,
    mode,
    selectedTag,
    onClickCancel,
    onClickAdd,
    onClickModify,
    onClickComplete
  };
};

export const useTagEditor = (InitState: { name?: string; color?: string; }) => {
  const [name, setName] = useState(InitState?.name || "");
  const [color, setColor] = useState(InitState?.color || DefaultColors[0]);

  const handleColor = useCallback((color: ColorResult) => {
    setColor(color.hex);
  }, []);
  return {
    name, color, setName, handleColor
  }
}

export default useTag;
