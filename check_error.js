import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
  console.log('Page loaded');
  
  // Click on each tab
  const tabs = [
    "Recent Publications",
    "Latest Chapters",
    "Journal Releases",
    "Recent Activity",
    "Programmes & Events"
  ];
  
  for (const tab of tabs) {
    console.log(`Clicking tab: ${tab}`);
    try {
      const [el] = await page.$x(`//div[@role="button" and contains(., "${tab}")]`);
      if (el) {
        await el.click();
        await new Promise(r => setTimeout(r, 500));
      } else {
        console.log(`Tab not found: ${tab}`);
      }
    } catch (e) {
      console.log(`Error clicking tab ${tab}:`, e.message);
    }
  }

  await browser.close();
})();
