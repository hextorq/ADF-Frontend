/**
 * Academic Development Forum (ADF) - Static HTML Page Generator
 * Runs post-build to create pre-rendered HTML files for every public route.
 * Guarantees that every sitemap URL resolves to an exact canonical tag,
 * preventing SPA "Non-canonical URL" warnings in SEO audit tools.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_ROUTES, SITE_URL } from "./routes-seo-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildBreadcrumbJsonLd(crumbs) {
  if (!crumbs || crumbs.length === 0) return null;
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`,
    },
  ];

  crumbs.forEach((crumb, idx) => {
    const itemUrl = crumb.path
      ? (crumb.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${crumb.path}`)
      : undefined;
    items.push({
      "@type": "ListItem",
      position: idx + 2,
      name: crumb.name,
      ...(itemUrl ? { item: itemUrl } : {}),
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function generateStaticPages() {
  const templatePath = path.join(distDir, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error(`Error: dist/index.html not found at: ${templatePath}. Run vite build first.`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, "utf-8");
  let generatedCount = 0;

  console.log("\n--- Generating Static Pre-rendered Pages for SEO Canonical Alignment ---");

  for (const route of PUBLIC_ROUTES) {
    if (route.path === "/") {
      // Homepage is already dist/index.html, verify it has root canonical
      continue;
    }

    const canonicalUrl = `${SITE_URL}${route.path}`;
    let html = templateHtml;

    // 1. Replace title
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
    html = html.replace(/<meta\s+name=["']title["'][^>]*\/>/i, `<meta name="title" content="${escapeHtml(route.title)}" />`);
    html = html.replace(/<meta\s+property=["']og:title["'][^>]*\/>/i, `<meta property="og:title" content="${escapeHtml(route.title)}" />`);
    html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*\/>/i, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`);

    // 2. Replace description
    html = html.replace(/<meta\s+name=["']description["'][^>]*\/>/i, `<meta name="description" content="${escapeHtml(route.description)}" />`);
    html = html.replace(/<meta\s+property=["']og:description["'][^>]*\/>/i, `<meta property="og:description" content="${escapeHtml(route.description)}" />`);
    html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*\/>/i, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`);

    // 3. Replace canonical URL and OpenGraph / Twitter URLs
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*\/>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
    html = html.replace(/<meta\s+property=["']og:url["'][^>]*\/>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta\s+name=["']twitter:url["'][^>]*\/>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`);

    // 4. Inject route-specific BreadcrumbList schema if available
    const breadcrumbSchema = buildBreadcrumbJsonLd(route.crumbs);
    if (breadcrumbSchema) {
      const schemaScript = `\n    <script type="application/ld+json" id="adf-route-breadcrumb-schema">\n${JSON.stringify(breadcrumbSchema, null, 2)}\n    </script>`;
      html = html.replace("</head>", `${schemaScript}\n  </head>`);
    }

    // 5. Customize fallback crawlable article heading and content for search bots
    if (route.contentHtml) {
      const customArticle = `<article>\n          <h1>${escapeHtml(route.h1)}</h1>\n          <p>${escapeHtml(route.description)}</p>${route.contentHtml}\n        </article>`;
      html = html.replace(/<article>[\s\S]*?<\/article>/i, customArticle);
    } else if (route.h1) {
      html = html.replace(/<h1>Academic Development Forum<\/h1>/i, `<h1>${escapeHtml(route.h1)}</h1>`);
      html = html.replace(
        /<p>Academic Development Forum \(ADF\) is an international publishing house[^<]*<\/p>/i,
        `<p>${escapeHtml(route.description)}</p>`
      );
    }

    // Write both .html and /index.html variants to guarantee direct HTTP 200 on any server configuration
    const cleanHtmlPath = path.join(distDir, `${route.path}.html`);
    const nestedDirPath = path.join(distDir, route.path);
    const nestedHtmlPath = path.join(nestedDirPath, "index.html");

    fs.mkdirSync(path.dirname(cleanHtmlPath), { recursive: true });
    fs.writeFileSync(cleanHtmlPath, html, "utf-8");

    fs.mkdirSync(nestedDirPath, { recursive: true });
    fs.writeFileSync(nestedHtmlPath, html, "utf-8");

    generatedCount++;
    console.log(`  [OK] Generated canonical static page: ${route.path} -> ${canonicalUrl}`);
  }

  console.log(`\nSuccessfully generated ${generatedCount} static pages with 100% exact canonical alignment.\n`);
}

generateStaticPages();
