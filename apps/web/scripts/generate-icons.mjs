import sharp from "sharp";
import { mkdir } from "fs/promises";
import { join } from "path";

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = join(import.meta.dirname, "public", "icons");

await mkdir(outDir, { recursive: true });

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#08090d"/>
      <stop offset="100%" style="stop-color:#12141d"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <rect x="32" y="32" width="448" height="448" rx="64" fill="none" stroke="#00f3ff" stroke-width="3" opacity="0.3"/>
  <text x="256" y="220" text-anchor="middle" font-family="monospace,sans-serif" font-size="80" font-weight="bold" fill="#00f3ff" filter="url(#glow)">CY</text>
  <text x="256" y="320" text-anchor="middle" font-family="monospace,sans-serif" font-size="42" font-weight="bold" fill="#ff0055" filter="url(#glow)">DRO</text>
  <text x="256" y="380" text-anchor="middle" font-family="monospace,sans-serif" font-size="24" fill="#708090">QUIZ</text>
</svg>
`;

for (const size of sizes) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(outDir, `icon-${size}.png`));
  console.log(`Created icon-${size}.png`);
}

console.log("All icons generated.");
