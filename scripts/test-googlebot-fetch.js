import https from "https";

const userAgents = [
  {
    name: "Googlebot Smartphone",
    ua: "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.175 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
  },
  {
    name: "Googlebot Desktop",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/125.0.6422.175 Safari/537.36"
  }
];

const targets = [
  { url: "https://www.adf.ijeae.com/assets/index-371b2dp5.js", dest: "script", mode: "cors" },
  { url: "https://www.adf.ijeae.com/assets/vendor-react-B6QgK5V0.js", dest: "script", mode: "cors" },
  { url: "https://www.adf.ijeae.com/logo.png", dest: "image", mode: "no-cors" }
];

async function check(uaObj, target) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.get(target.url, {
      headers: {
        "User-Agent": uaObj.ua,
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Sec-Fetch-Dest": target.dest,
        "Sec-Fetch-Mode": target.mode,
        "Sec-Fetch-Site": "same-origin",
        "Referer": "https://www.adf.ijeae.com/"
      }
    }, (res) => {
      let len = 0;
      res.on("data", c => len += c.length);
      res.on("end", () => {
        resolve({
          ua: uaObj.name,
          url: target.url,
          status: res.statusCode,
          contentType: res.headers["content-type"],
          contentEncoding: res.headers["content-encoding"],
          len,
          time: Date.now() - start
        });
      });
    });
    req.on("error", err => {
      resolve({ ua: uaObj.name, url: target.url, error: err.message });
    });
  });
}

async function run() {
  for (const ua of userAgents) {
    console.log(`\n=== Testing UA: ${ua.name} ===`);
    for (const t of targets) {
      const r = await check(ua, t);
      console.log(`${r.url}: HTTP ${r.status} (${r.contentType}, ${r.len}b, enc: ${r.contentEncoding}) in ${r.time}ms`);
    }
  }
  process.exit(0);
}

run();
