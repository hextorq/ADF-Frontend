import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { PUBLIC_ROUTES, SITE_URL as DEFAULT_SITE_URL } from "./routes-seo-data.js";

const SITE_URL = process.env.VITE_SITE_URL || DEFAULT_SITE_URL;
const cleanBaseUrl = SITE_URL.replace(/\/+$/, "");
const today = new Date().toISOString().split("T")[0];

function generateSitemap() {
  const urls = PUBLIC_ROUTES.map(
    (route) => `  <url>
    <loc>${cleanBaseUrl}${route.path === "/" ? "/" : route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  ).join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>
`;

  const outputPath = path.resolve(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(outputPath, sitemapXml, "utf8");
  console.log(`Sitemap generated successfully at: ${outputPath} (${PUBLIC_ROUTES.length} routes)`);
}

generateSitemap();
