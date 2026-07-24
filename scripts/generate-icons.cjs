const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(__dirname, "..", "apps", "web", "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'>
  <defs>
    <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' style='stop-color:#08090d'/>
      <stop offset='100%' style='stop-color:#12141d'/>
    </linearGradient>
  </defs>
  <rect width='512' height='512' rx='96' fill='url(#bg)'/>
  <rect x='32' y='32' width='448' height='448' rx='64' fill='none' stroke='#00f3ff' stroke-width='3' opacity='0.3'/>
  <text x='256' y='210' text-anchor='middle' font-family='monospace,sans-serif' font-size='80' font-weight='bold' fill='#00f3ff'>CY</text>
  <text x='256' y='310' text-anchor='middle' font-family='monospace,sans-serif' font-size='42' font-weight='bold' fill='#ff0055'>DRO</text>
  <text x='256' y='380' text-anchor='middle' font-family='monospace,sans-serif' font-size='24' fill='#708090'>QUIZ</text>
</svg>`;

Promise.all(
  sizes.map((size) =>
    sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`))
  )
).then(() => console.log("All icons generated"));
