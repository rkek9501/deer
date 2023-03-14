import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppContext } from "@context";
import usePreventBodyScorll from "@hooks/usePreventBodyScroll";
import RequestHelper from "@utils/requestHelper";
import { checkToken } from "@utils/tokenManager";

export type PostType = {
  title: string;
  content: string;
  user?: any;
  createdAt: string;
  tags?: any[];
};

const useLoadPost = () => {
  const { setLoading } = useContext(AppContext);
  const [data, setData] = useState<PostType | null>(null);
  const [hData, setHData] = useState<any>([]);
  const [session, setSession] = useState(false);
  const [recomend, setRecomend] = useState(null);
  const router = useRouter();
  const contentId = (typeof window !== "undefined" ? window?.location?.pathname.replace("/post/", "") : null)

  useEffect(() => {
    setSession(checkToken());
  }, []);

  usePreventBodyScorll();

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";
    console.log({contentId, isBrowser})
    if (!data  && contentId && isBrowser) {
      (async () => {
        const { response: contentRes, error } = await RequestHelper.Get({ url: "/api/post/item/" + contentId });
        const { response: recomendRes } = await RequestHelper.Get({ url: "/api/post/recommend/" + contentId });
        console.log({ contentRes, recomendRes });
        setRecomend(recomendRes?.data);

        const lines = contentRes?.data?.content?.split("\n");
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
        setHData(heading);
        setData({ ...contentRes?.data, content: contents });
        setLoading(false);
      })();
    }
  }, [data]);
  const gotoEdit = () => {
    setLoading(true);
    router.push({
      pathname: "/editor/[id]",
      query: { id: contentId }
    });
  };
  return {
    gotoEdit,
    data,
    hData,
    session,
    recomend
  }
}

export default useLoadPost;
