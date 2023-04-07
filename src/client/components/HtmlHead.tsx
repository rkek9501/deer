/* eslint-disable @next/next/no-css-tags */
import NextHead from "next/head";

type HeadProps = {
  title: string;
  withMeta?: boolean;
  description?: string;
  url?: string;
  image?: string;
  isHome?: boolean;
  isMarkdown?: boolean;
};

const Head = (Props: HeadProps) => {
  return (
    <NextHead>
      <meta charSet="utf-8" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      <meta name="description" content={Props.description || "Blog of Doyoung & Osu"} />
      <title>{Props.title}</title>

      {Props.withMeta && <meta property="og:title" content={Props.title} />}
      {Props.withMeta && <meta property="og:type" content="blog" />}
      {Props.withMeta && <meta property="og:description" content={Props.description || "Blog of Doyoung & Osu"} />}
      {Props.withMeta && <meta property="og:site_name" content="Deer's blog" />}
      {Props.withMeta && <meta property="og:url" content={Props.url || "https://de-er.link/"} />}
      {Props.withMeta && <meta property="og:image" content={Props.image || "https://de-er.link/img/Deer-og-img.png"} />}

      <link rel="stylesheet" type="text/css" href="/css/index.css" />
      <link rel="stylesheet" type="text/css" href="/css/fonts.css" />
      {Props.isHome && <link rel="stylesheet" type="text/css" href="/css/home.css" />}
      {Props.isHome && <link rel="stylesheet" type="text/css" href="/css/masonry.css" />}
      {Props.isMarkdown &&<link rel="stylesheet" type="text/css" href="/css/prism.css" />}
      {Props.isMarkdown && <link rel="stylesheet" type="text/css" href="/css/editor.css" />}

      <link rel="shortcut icon" href="/img/favi/favicon.ico" />
      <link rel="apple-touch-icon" sizes="57x57" href="/img/favi/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/img/favi/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/img/favi/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/img/favi/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/img/favi/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/img/favi/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/img/favi/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/img/favi/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/img/favi/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/img/favi/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/img/favi/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/img/favi/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/img/favi/favicon-16x16.png" />
      <link rel="manifest" href="/img/favi/manifest.json" />

      <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
    </NextHead>
  );
};

export default Head;
