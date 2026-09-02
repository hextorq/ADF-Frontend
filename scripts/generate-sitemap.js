import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = process.env.VITE_SITE_URL || "https://www.adf.ijeae.com";
const cleanBaseUrl = SITE_URL.replace(/\/+$/, "");
const today = new Date().toISOString().split("T")[0];

const PUBLIC_ROUTES = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/about", priority: "0.8", changefreq: "monthly" },
  { loc: "/journals", priority: "0.9", changefreq: "weekly" },
  { loc: "/chapter-publications", priority: "0.9", changefreq: "weekly" },
  { loc: "/chapter-publications/submit", priority: "0.8", changefreq: "monthly" },
  { loc: "/literary-publications", priority: "0.9", changefreq: "weekly" },
  { loc: "/literary-publications/submit", priority: "0.8", changefreq: "monthly" },
  { loc: "/academic-programmes", priority: "0.9", changefreq: "weekly" },
  { loc: "/bookstore", priority: "0.8", changefreq: "weekly" },
  { loc: "/announcements", priority: "0.8", changefreq: "daily" },
  { loc: "/editorial-board", priority: "0.8", changefreq: "monthly" },
  { loc: "/guidelines/author", priority: "0.8", changefreq: "monthly" },
  { loc: "/guidelines/editor", priority: "0.7", changefreq: "monthly" },
  { loc: "/guidelines/reviewer", priority: "0.7", changefreq: "monthly" },
  { loc: "/policies", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
];

function generateSitemap() {
  const urls = PUBLIC_ROUTES.map(
    (route) => `  <url>
    <loc>${cleanBaseUrl}${route.loc === "/" ? "/" : route.loc}</loc>
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
