import sharp from "sharp";

async function run() {
  const meta = await sharp("public/logo.png").metadata();
  console.log("LOGO METADATA:", {
    format: meta.format,
    width: meta.width,
    height: meta.height,
    channels: meta.channels,
    density: meta.density,
    hasProfile: !!meta.icc,
    space: meta.space
  });
  const buf = await sharp("public/logo.png").png({ compressionLevel: 9 }).toBuffer();
  console.log("Original size:", 1121003);
  console.log("Lossless compressed size:", buf.length);
  process.exit(0);
}

run();
