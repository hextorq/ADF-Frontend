import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const logoPath = path.resolve(publicDir, 'logo.png');

function createIco(images) {
  // images: Array of { width, height, buffer }
  const count = images.length;
  const headerLen = 6;
  const dirEntryLen = 16;
  let offset = headerLen + count * dirEntryLen;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset

    dirEntries.push(entry);
    imageBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

async function generateFavicons() {
  console.log('Generating Google-compliant square favicons from logo.png...');

  if (!fs.existsSync(logoPath)) {
    console.error('logo.png not found at:', logoPath);
    process.exit(1);
  }

  // Trim transparent or white borders to get core icon bounding box
  const trimmed = sharp(logoPath).trim();

  // Create square base on transparent background with slight padding (e.g. 512x512)
  const size = 512;
  const padding = 24;
  const innerSize = size - padding * 2;

  const innerBuffer = await trimmed
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toBuffer();

  const square512 = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    }
  })
    .composite([{ input: innerBuffer, gravity: 'center' }])
    .png()
    .toBuffer();

  // Write 512x512
  fs.writeFileSync(path.resolve(publicDir, 'favicon-512x512.png'), square512);
  console.log('  [OK] favicon-512x512.png');

  // Write 192x192 (Android / PWA standard)
  const pwa192 = await sharp(square512).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.resolve(publicDir, 'favicon-192x192.png'), pwa192);
  console.log('  [OK] favicon-192x192.png');

  // Write 180x180 (Apple Touch Icon)
  const apple180 = await sharp(square512).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.resolve(publicDir, 'apple-touch-icon.png'), apple180);
  console.log('  [OK] apple-touch-icon.png');

  // Write 96x96
  const icon96 = await sharp(square512).resize(96, 96).png().toBuffer();
  fs.writeFileSync(path.resolve(publicDir, 'favicon-96x96.png'), icon96);
  console.log('  [OK] favicon-96x96.png');

  // Write 48x48 (Googlebot Official Favicon Requirement: multiple of 48px square)
  const icon48 = await sharp(square512).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.resolve(publicDir, 'favicon-48x48.png'), icon48);
  console.log('  [OK] favicon-48x48.png (Googlebot Favicon)');

  // Write 32x32 & 16x16
  const icon32 = await sharp(square512).resize(32, 32).png().toBuffer();
  const icon16 = await sharp(square512).resize(16, 16).png().toBuffer();

  // Generate multi-size favicon.ico
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: icon16 },
    { width: 32, height: 32, buffer: icon32 },
    { width: 48, height: 48, buffer: icon48 },
  ]);
  fs.writeFileSync(path.resolve(publicDir, 'favicon.ico'), icoBuffer);
  console.log('  [OK] favicon.ico (multi-size: 16x16, 32x32, 48x48)');

  // Create site.webmanifest
  const manifest = {
    name: "Academic Development Forum",
    short_name: "ADF",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#071a8c",
    icons: [
      {
        src: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
  fs.writeFileSync(path.resolve(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('  [OK] site.webmanifest');

  console.log('\nAll favicons generated successfully!\n');
}

generateFavicons();
