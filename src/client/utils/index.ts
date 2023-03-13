export const queryParser = (query: string) => {
  try {
    const _queryString = query.split("?")[1];
    const _queries = _queryString.split("&");
    const querySet: any = {};
    for (const _query of _queries) {
      const _qs = _query.split("=");
      querySet[_qs[0]] = _qs[1];
    }
    return querySet;
  } catch (e) {
    return {};
  }
};

export const createLink = (href: string) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = href;
  document.getElementsByTagName("head")[0].appendChild(link);
  return link;
};

export const DefaultColors = ["#A2D39B", "#62D0DD", "#CEB4FF", "#FF708B", "#FF8E21", "#AFD223", "#708FFF", "#FF66B9", "#FF5151", "#F4E8A4"];
const min = 0,
  max = 9;
export const getRandomColor = () => {
  const random = Math.floor(Math.random() * (max - min)) + min;
  return DefaultColors[random];
};
