import path from "path";
import fs from "fs";
import moment from "moment";
import { HOST_URL } from "../env";

const generatePostSiteMap = (sites: any[]) => {
  return sites
    .filter((post: any) => post?.openState === "Y")
    .map(
      (post) => `  <url>
    <loc>${HOST_URL}/post/${post.subpath}</loc>
    <priority>1.0</priority>
    <lastmod>${moment(post.updatedAt).format("YYYY-MM-DD")}</lastmod>
  </url>`
    ).join(`
`);
};

const generateSiteMap = (sites: any[]) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${HOST_URL}/</loc>
    <priority>0.0</priority>
  </url>
${generatePostSiteMap(sites)}
</urlset>`;
  const sitemapPath = path.join(process.cwd(), "public/sitemap.xml");

  console.log("[Server] Re-Generate Sitemap");
  fs.writeFileSync(sitemapPath, sitemap, "utf8");
};

export default generateSiteMap;
