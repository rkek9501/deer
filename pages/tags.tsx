import requestHelper from "@utils/requestHelper";
import React, { useEffect, useState } from "react";

const TagPage = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const request = async () => {
      const { response, error } = await requestHelper.Get({ url: "/api/post/tags" });
      // console.log({ response, error });
      if (error || !response.result) {
        alert("!!!");
        return;
      }
      setTags(response.data);
    };
    request();
  }, []);

  return (
    <div style={{}}>
      {tags.map((tag: any, key: number) => {
        return <div key={key} style={{ backgroundColor: tag.color }}>{tag.name}</div>;
      })}
    </div>
  );
};

export default TagPage;
