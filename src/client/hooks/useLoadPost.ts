import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import { AppContext } from "@context";
import { checkToken } from "@utils/tokenManager";
import { getFetcher } from "@utils/swrFetcher";
import usePreventBodyScorll from "@hooks/usePreventBodyScroll";

export type PostType = {
  title: string;
  content: string;
  user?: any;
  createdAt: string;
  tags?: any[];
};

const useLoadPost = (data: any, contentId: string) => {
  const { setLoading } = useContext(AppContext);
  const [content, setContent] = useState<string>("");
  const [hData, setHData] = useState<any>([]);
  const [session, setSession] = useState(false);
  const router = useRouter();

  const { data: recomend, isLoading, error } = useSWR(`/api/post/recommend/${contentId}`, getFetcher);

  useEffect(() => {
    setSession(checkToken());
  }, []);

  usePreventBodyScorll();

  useEffect(() => {
    const lines = data?.content?.split("\n");
    const heading: any[] = [];
    const content = [];
    let isCodeBlock = false;
    for (const [idx, line] of lines?.entries() || []) {
      if (line.indexOf("```") !== -1) {
        isCodeBlock = !isCodeBlock;
      }
      if (line.indexOf("# ") === 0 && !isCodeBlock) {
        content.push(`${line} <a id="bookmark_${idx}" class="bookmarked" style="visibility:hidden;"></a>`);
        heading.push({ type: "h1", line: line.slice(2), idx: `bookmark_${idx}` });
      } else if (line.indexOf("## ") === 0 && !isCodeBlock) {
        content.push(`${line} <a id="bookmark_${idx}" class="bookmarked" style="visibility:hidden;"></a>`);
        heading.push({ type: "h2", line: line.slice(3), idx: `bookmark_${idx}` });
      } else if (line.indexOf("### ") === 0 && !isCodeBlock) {
        content.push(`${line} <a id="bookmark_${idx}" class="bookmarked" style="visibility:hidden;"></a>`);
        heading.push({ type: "h3", line: line.slice(4), idx: `bookmark_${idx}` });
      } else {
        content.push(line);
      }
    }
    const contents = content.join("\n");
    setContent(contents);
    setHData(heading);
    setLoading(false);
  }, []);

  const gotoEdit = () => {
    setLoading(true);
    router.push({
      pathname: "/editor/[id]",
      query: { id: contentId }
    });
  };

  const goToTop = (e: React.MouseEvent<HTMLElement>) => {
    document.getElementById("scroller")?.scrollTo(0, 0);
    e.stopPropagation();
    e.preventDefault();
  };

  return {
    gotoEdit,
    goToTop,
    content,
    hData,
    session,
    recomend: recomend?.data
  };
};

export default useLoadPost;
