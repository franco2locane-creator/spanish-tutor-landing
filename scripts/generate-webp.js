#!/usr/bin/env node
// One-off conversion: assets/francoportrait.jpg -> assets/francoportrait.webp
// Re-run this if the source JPEG is ever replaced.
//
//   node scripts/generate-webp.js

const path = require("path");
const sharp = require("sharp");

const src = path.join(__dirname, "..", "assets", "francoportrait.jpg");
const dest = path.join(__dirname, "..", "assets", "francoportrait.webp");

sharp(src)
  .webp({ quality: 82 })
  .toFile(dest)
  .then((info) => {
    console.log(`WebP written: ${dest} (${info.width}x${info.height}, ${info.size} bytes)`);
  })
  .catch((err) => {
    console.error("WebP generation failed:", err);
    process.exitCode = 1;
  });
