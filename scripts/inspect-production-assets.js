import https from "https";

const urls = [
  "https://www.adf.ijeae.com/",
  "https://www.adf.ijeae.com/assets/index-371b2dp5.js",
  "https://www.adf.ijeae.com/assets/vendor-react-B6QgK5V0.js",
  "https://www.adf.ijeae.com/logo.png",
  "https://www.adf.ijeae.com/assets/index-uue9dH_q.js",
  "https://www.adf.ijeae.com/assets/non-existent-test-file.js"
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
          "Accept-Encoding": "identity",
          "Origin": "https://www.adf.ijeae.com",
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve({
            url,
            statusCode: res.statusCode,
            headers: res.headers,
            length: buffer.length,
            snippet: buffer.slice(0, 160).toString("utf8"),
            binarySample: buffer.slice(0, 8),
            fullText: buffer.toString("utf8"),
          });
        });
      }
    );
    req.on("error", (err) => resolve({ url, error: err.message }));
  });
}

async function run() {
  const root = await fetchUrl("https://www.adf.ijeae.com/");
  console.log("=== ROOT HTML ASSET TAGS ===");
  const scripts = root.fullText.match(/<script[^>]+src=["']([^"']+)["'][^>]*>/g) || [];
  const links = root.fullText.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/g) || [];
  const imgs = root.fullText.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/g) || [];
  console.log("SCRIPTS in production HTML:", scripts);
  console.log("LINKS (assets/icons/preload):", links.filter(l => l.includes("asset") || l.includes("logo") || l.includes("icon") || l.includes("modulepreload")));
  console.log("IMGS in production HTML:", imgs);

  console.log("\n=== TESTING TARGET ASSETS ===");
  for (const url of urls) {
    const res = await fetchUrl(url);
    console.log("URL:", res.url);
    console.log("Status:", res.statusCode);
    console.log("Content-Type:", res.headers?.["content-type"]);
    console.log("Content-Length Header:", res.headers?.["content-length"]);
    console.log("Cache-Control:", res.headers?.["cache-control"]);
    console.log("Access-Control-Allow-Origin:", res.headers?.["access-control-allow-origin"]);
    console.log("Actual Size (bytes):", res.length);
    console.log("-----------------------------------------");
  }
  process.exit(0);
}


run();
