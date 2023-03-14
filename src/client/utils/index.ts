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

export const getTextColorByBackgroundColor = (hexColor: string) => {
  const c = hexColor.substring(1) // 색상 앞의 # 제거
  const rgb = parseInt(c, 16)     // rrggbb를 10진수로 변환
  const r = (rgb >> 16) & 0xff    // red 추출
  const g = (rgb >>  8) & 0xff    // green 추출
  const b = (rgb >>  0) & 0xff    // blue 추출
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  return luma < 127.5 ? "white" : "black";
};