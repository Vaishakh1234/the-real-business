/**
 * One-off: resize public/logo-icon-bg.png into PWA / notification icon sizes.
 * Run: npx tsx scripts/generate-pwa-icons.ts
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "public", "logo-icon-bg.png");
const outDir = path.join(root, "public", "icons");

async function main() {
  await mkdir(outDir, { recursive: true });

  await sharp(src).resize(192, 192, { fit: "cover" }).png().toFile(path.join(outDir, "icon-192.png"));
  await sharp(src).resize(512, 512, { fit: "cover" }).png().toFile(path.join(outDir, "icon-512.png"));

  // Maskable: logo within ~80% safe zone on 512 canvas
  const safe = Math.round(512 * 0.8);
  const inner = await sharp(src).resize(safe, safe, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: inner, left: Math.round((512 - safe) / 2), top: Math.round((512 - safe) / 2) }])
    .png()
    .toFile(path.join(outDir, "maskable-512.png"));

  await sharp(src).resize(180, 180, { fit: "cover" }).png().toFile(path.join(root, "public", "apple-touch-icon.png"));

  console.log("Wrote public/icons/icon-192.png, icon-512.png, maskable-512.png, public/apple-touch-icon.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
