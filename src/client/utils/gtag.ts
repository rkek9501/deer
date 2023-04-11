export const FB_STREAM_GID = process.env.FB_STREAM_GID;

export const pageview = (url: string) => {
  if (process.env.NODE_ENV === "production")
    return (<any>window).gtag("config", FB_STREAM_GID, {
      page_path: url
    });
};

export const event = ({ action, category, label, value }: any) => {
  if (process.env.NODE_ENV === "production")
    return (<any>window).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value
    });
};
