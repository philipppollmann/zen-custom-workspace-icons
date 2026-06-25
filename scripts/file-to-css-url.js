const fs = require("fs");
const path = require("path");

const file = process.argv[2];

if (!file) {
  console.error("Usage: node scripts/file-to-css-url.js ./icon.svg");
  process.exit(1);
}

const mimeByExt = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const ext = path.extname(file).toLowerCase();
const mime = mimeByExt[ext];

if (!mime) {
  console.error(`Unsupported icon type: ${ext || "(no extension)"}`);
  console.error("Supported types: .svg, .png, .webp, .jpg, .jpeg, .gif");
  process.exit(1);
}

const data = fs.readFileSync(file).toString("base64");

console.log(`url("data:${mime};base64,${data}")`);
