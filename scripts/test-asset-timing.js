import https from "https";

const urls = [
  "https://www.adf.ijeae.com/",
  "https://www.adf.ijeae.com/assets/index-371b2dp5.js",
  "https://www.adf.ijeae.com/assets/vendor-react-B6QgK5V0.js",
  "https://www.adf.ijeae.com/logo.png"
];

async function run() {
  for (const url of urls) {
    const start = Date.now();
    await new Promise((resolve) => {
      https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "Accept-Encoding": "gzip, deflate, br" } }, (res) => {
        let len = 0;
        res.on("data", c => len += c.length);
        res.on("end", () => {
          console.log(`${url}: ${res.statusCode} ${res.headers["content-type"]} (${len} bytes transferred, uncompressed/compressed, enc: ${res.headers["content-encoding"]}) in ${Date.now() - start}ms`);
          resolve();
        });
      }).on("error", e => {
        console.log(`${url}: ERROR ${e.message} in ${Date.now() - start}ms`);
        resolve();
      });
    });
  }
  console.log("ALL REQUESTS FINISHED in " + (Date.now() - overallStart) + "ms");
  process.exit(0);
}

const overallStart = Date.now();
run();
