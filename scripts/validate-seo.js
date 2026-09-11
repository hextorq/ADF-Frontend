/**
 * Academic Development Forum (ADF) - Automated SEO & Standards Validator
 * Validates meta tags, title lengths, description lengths, canonical URLs,
 * heading structure, sitemap, robots.txt, and structured data.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(title, condition, detail = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${title}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL] ${title} ${detail ? `(${detail})` : ''}`);
  }
}

console.log('\n--- ADF SEO & STANDARDS AUTOMATED VALIDATION ---\n');

// 1. Validate index.html
console.log('1. Checking index.html:');
const indexPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

// Title check
const titleMatch = indexHtml.match(/<title>([^<]+)<\/title>/i);
const titleText = titleMatch ? titleMatch[1].trim() : '';
check('Title tag exists', !!titleMatch);
check(
  `Title length <= 60 characters (current: ${titleText.length})`,
  titleText.length > 0 && titleText.length <= 60,
  `Title: "${titleText}"`
);

// Meta description check
const descMatch = indexHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
const descText = descMatch ? descMatch[1].trim() : '';
check('Meta description tag exists', !!descMatch);
check(
  `Meta description <= 160 characters (current: ${descText.length})`,
  descText.length >= 100 && descText.length <= 160,
  `Description: "${descText}"`
);

// Canonical link check
const canonicalMatch = indexHtml.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
const canonicalHref = canonicalMatch ? canonicalMatch[1].trim() : '';
check('Canonical link tag exists', !!canonicalMatch);
check(
  'Canonical URL points to preferred https://www.adf.ijeae.com/',
  canonicalHref === 'https://www.adf.ijeae.com/',
  `Found: "${canonicalHref}"`
);

// Semantic Fallback Headings in index.html
const h1Matches = indexHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
check(
  `Exact 1 H1 heading in initial HTML (found: ${h1Matches.length})`,
  h1Matches.length === 1,
  `H1: ${h1Matches[0]}`
);

const h2Matches = indexHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
check(
  `Crawlable H2 headings present in initial HTML (found: ${h2Matches.length})`,
  h2Matches.length >= 3
);

// Crawlable navigation links
const navLinkMatches = indexHtml.match(/<a\s+href=["'](\/[a-z0-9\-_]+)["']/gi) || [];
check(
  `Crawlable internal navigation links present (found: ${navLinkMatches.length})`,
  navLinkMatches.length >= 5
);

// Open Graph and Twitter cards
check('og:title present', indexHtml.includes('property="og:title"'));
check('og:description present', indexHtml.includes('property="og:description"'));
check('og:url points to www.adf.ijeae.com', indexHtml.includes('https://www.adf.ijeae.com/'));
check('twitter:card present', indexHtml.includes('name="twitter:card"'));

// Structured Data (JSON-LD) in index.html
check('JSON-LD schema present in index.html', indexHtml.includes('application/ld+json'));
check('EducationalOrganization schema included', indexHtml.includes('EducationalOrganization'));
check('WebSite schema included', indexHtml.includes('"@type": "WebSite"'));
check('SearchAction included', indexHtml.includes('"@type": "SearchAction"'));


// 2. Validate robots.txt
console.log('\n2. Checking robots.txt:');
const robotsPath = path.join(rootDir, 'public', 'robots.txt');
const robotsTxt = fs.readFileSync(robotsPath, 'utf-8');
check('robots.txt exists', fs.existsSync(robotsPath));
check(
  'robots.txt points to canonical sitemap https://www.adf.ijeae.com/sitemap.xml',
  robotsTxt.includes('Sitemap: https://www.adf.ijeae.com/sitemap.xml')
);
check('robots.txt protects /admin', robotsTxt.includes('Disallow: /admin'));


// 3. Validate sitemap.xml
console.log('\n3. Checking sitemap.xml:');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8');
check('sitemap.xml exists', fs.existsSync(sitemapPath));
check(
  'sitemap.xml uses canonical https://www.adf.ijeae.com domain',
  sitemapXml.includes('<loc>https://www.adf.ijeae.com/</loc>')
);
check(
  'sitemap.xml does NOT contain non-canonical adf.ijeae.com (non-www) URLs',
  !sitemapXml.match(/<loc>https?:\/\/adf\.ijeae\.com/i)
);

// Check that all sitemap routes are discoverable in index.html crawlable skeleton
const locMatches = [...sitemapXml.matchAll(/<loc>https:\/\/www\.adf\.ijeae\.com([^<]*)<\/loc>/g)];
let allSitemapRoutesDiscovered = true;
let missingRoutes = [];
for (const m of locMatches) {
  const routePath = m[1] || '/';
  const found = routePath === '/'
    ? (indexHtml.includes('href="/"') || indexHtml.includes('href="https://www.adf.ijeae.com/"'))
    : indexHtml.includes(`href="${routePath}"`);
  if (!found) {
    allSitemapRoutesDiscovered = false;
    missingRoutes.push(routePath);
  }
}
check(
  `All sitemap URLs (${locMatches.length}) discoverable via internal links in HTML skeleton (zero orphans)`,
  allSitemapRoutesDiscovered,
  `Missing: ${missingRoutes.join(', ')}`
);


// 4. Validate vercel.json
console.log('\n4. Checking vercel.json:');
const vercelPath = path.join(rootDir, 'vercel.json');
const vercelJson = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
const hasHostRedirect = (vercelJson.redirects || []).some(
  (r) => r.has && r.has.some((h) => h.type === 'host' && h.value === 'adf.ijeae.com')
);
check(
  'vercel.json contains 301/permanent redirect from adf.ijeae.com to www.adf.ijeae.com',
  hasHostRedirect
);
check('vercel.json cleanUrls is true (prevents .html in URLs and serves static pages directly)', vercelJson.cleanUrls === true);
check('vercel.json trailingSlash is false (prevents slash redirects)', vercelJson.trailingSlash === false);
const hasSecurityHeaders = (vercelJson.headers || []).some(
  (h) => h.headers && h.headers.some((header) => header.key === 'X-Content-Type-Options')
);
check('vercel.json contains security headers (X-Content-Type-Options, etc.)', hasSecurityHeaders);


// 5. Validate Sitemap URLs vs Canonical in Pre-rendered Dist Files
console.log('\n5. Checking Dist Pre-rendered HTML Canonical Alignment:');
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  let canonicalMismatches = 0;
  let missingFiles = 0;
  for (const m of locMatches) {
    const routePath = m[1] || '/';
    const sitemapUrl = `https://www.adf.ijeae.com${routePath === '/' ? '/' : routePath}`;
    const cleanHtmlFile = routePath === '/' ? path.join(distDir, 'index.html') : path.join(distDir, `${routePath}.html`);
    if (!fs.existsSync(cleanHtmlFile)) {
      missingFiles++;
      console.error(`  Missing pre-rendered file: ${cleanHtmlFile}`);
      continue;
    }
    const html = fs.readFileSync(cleanHtmlFile, 'utf-8');
    const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    const pageCanonical = canonMatch ? canonMatch[1] : null;
    if (pageCanonical !== sitemapUrl) {
      canonicalMismatches++;
      console.error(`  Canonical mismatch on ${routePath}: sitemap has ${sitemapUrl} but page has ${pageCanonical}`);
    }
  }
  check(
    `All ${locMatches.length} sitemap URLs have matching pre-rendered files in dist (missing: ${missingFiles})`,
    missingFiles === 0
  );
  check(
    `100% exact canonical match between sitemap.xml and HTML <head> for all ${locMatches.length} pages (0 mismatches)`,
    canonicalMismatches === 0
  );
} else {
  console.log('  (dist directory not found, run npm run build to validate pre-rendered pages)');
}


// 5. Validate PAGE_SEO in App.tsx
console.log('\n5. Checking App.tsx PAGE_SEO lengths:');
const appPath = path.join(rootDir, 'src', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf-8');

// Simple regex extraction of page SEO title/description entries
const titleRegex = /title:\s*"([^"]+)"/g;
let match;
let allTitlesValid = true;
let titleCount = 0;
while ((match = titleRegex.exec(appContent)) !== null) {
  const t = match[1];
  titleCount++;
  if (t.length > 65) { // allow small margin for non-public fallbacks
    allTitlesValid = false;
    console.error(`  Warning: Title too long (${t.length} chars): "${t}"`);
  }
}
check(`All page titles in App.tsx fit SERP constraints (checked ${titleCount} entries)`, allTitlesValid);

const descRegex = /description:\s*"([^"]+)"/g;
let allDescriptionsValid = true;
let descCount = 0;
while ((match = descRegex.exec(appContent)) !== null) {
  const d = match[1];
  descCount++;
  if (d.length > 165) {
    allDescriptionsValid = false;
    console.error(`  Warning: Description too long (${d.length} chars): "${d}"`);
  }
}
check(`All page descriptions in App.tsx fit SERP constraints (checked ${descCount} entries)`, allDescriptionsValid);


// Summary
console.log('\n--- VALIDATION SUMMARY ---');
console.log(`Total checks: ${totalChecks}`);
console.log(`Passed:       ${passedChecks}`);
console.log(`Failed:       ${failedChecks}`);

if (failedChecks > 0) {
  console.error(`\nValidation FAILED with ${failedChecks} errors.\n`);
  process.exit(1);
} else {
  console.log('\nAll SEO validation checks PASSED successfully!\n');
  process.exit(0);
}
