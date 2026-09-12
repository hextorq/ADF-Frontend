import https from "https";

const testUrls = [
  "https://www.adf.ijeae.com/missing-logo.png",
  "https://www.adf.ijeae.com/assets/missing.js",
  "https://www.adf.ijeae.com/images/missing.png",
  "https://www.adf.ijeae.com/some/path/file.js"
];

async function check() {
  for (const url of testUrls) {
    await new Promise((resolve) => {
      https.get(url, (res) => {
        let body = "";
        res.on("data", c => body += c);
        res.on("end", () => {
          console.log(`URL: ${url}`);
          console.log(`Status: ${res.statusCode}`);
          console.log(`Content-Type: ${res.headers["content-type"]}`);
          console.log(`Body starts with: ${JSON.stringify(body.slice(0, 100))}`);
          console.log("---------------------------------------");
          resolve();
        });
      });
    });
  }
  process.exit(0);
}

check();
