import https from 'node:https';

const routes = [
  '/',
  '/about',
  '/journals',
  '/chapter-publications',
  '/chapter-publications/submit',
  '/literary-publications',
  '/literary-publications/submit',
  '/bookstore',
  '/academic-programmes',
  '/guidelines',
  '/guidelines/author',
  '/guidelines/editor',
  '/guidelines/reviewer',
  '/editorial-board',
  '/policies',
  '/contact'
];

async function testRoute(path) {
  return new Promise((resolve) => {
    https.get('https://www.adf.ijeae.com' + path, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const titleMatch = body.match(/<title>([^<]*)<\/title>/i);
        const canonMatch = body.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
        const ogUrlMatch = body.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i);
        const twUrlMatch = body.match(/<meta\s+name=["']twitter:url["']\s+content=["']([^"']*)["']/i);
        const ogTitleMatch = body.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
        const descMatch = body.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
        const h1Match = body.match(/<h1[^>]*>([^<]*)<\/h1>/i);
        const hasBreadcrumb = body.includes('adf-route-breadcrumb-schema') || body.includes('"@type": "BreadcrumbList"');
        const hasOrgSchema = body.includes('EducationalOrganization');
        
        resolve({
          path,
          status: res.statusCode,
          title: titleMatch ? titleMatch[1] : null,
          canonical: canonMatch ? canonMatch[1] : null,
          ogUrl: ogUrlMatch ? ogUrlMatch[1] : null,
          twUrl: twUrlMatch ? twUrlMatch[1] : null,
          ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
          description: descMatch ? descMatch[1] : null,
          h1: h1Match ? h1Match[1] : null,
          hasBreadcrumb,
          hasOrgSchema
        });
      });
    }).on('error', err => {
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log('--- COMPREHENSIVE PRODUCTION AUDIT OF ALL 16 PUBLIC ROUTES ---');
  let issues = 0;
  for (const r of routes) {
    const res = await testRoute(r);
    const expectedUrl = `https://www.adf.ijeae.com${r === '/' ? '/' : r}`;
    const canonOk = res.canonical === expectedUrl;
    const ogOk = res.ogUrl === expectedUrl;
    const twOk = res.twUrl === expectedUrl;
    const statusOk = res.status === 200;

    if (!canonOk || !ogOk || !twOk || !statusOk) {
      issues++;
      console.error(`[FAIL] ${r}: Canonical: ${res.canonical}, OG: ${res.ogUrl}, Status: ${res.status}`);
    } else {
      console.log(`[PASS] ${r}`);
      console.log(`       Title:     ${res.title}`);
      console.log(`       Canonical: ${res.canonical}`);
      console.log(`       H1:        ${res.h1}`);
      console.log(`       OG URL:    ${res.ogUrl}`);
      console.log(`       Breadcrumb Schema: ${res.hasBreadcrumb ? 'YES' : 'NONE'}`);
    }
  }
  console.log(`\nTOTAL AUDITED: ${routes.length}, ISSUES FOUND: ${issues}`);
}

run();
