#!/usr/bin/env node
// Single source of truth for the deployed URL: site.config.json.
//
// Meta tags are read by scrapers that don't execute JS, so they can't be
// live JS variables — this script writes the literal values into
// index.html from one place instead. Re-run it any time site.config.json
// changes (e.g. moving to a real domain later).
//
//   node scripts/apply-site-url.js
//
// qr/generate-qr.js reads the same site.config.json as its default, so
// site.config.json is the one constant both consumers read from.

const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "site.config.json");
const indexPath = path.join(__dirname, "..", "index.html");

const { siteUrl } = require(configPath);
if (!siteUrl || !siteUrl.endsWith("/")) {
  console.error('site.config.json "siteUrl" must be set and end with a trailing slash.');
  process.exit(1);
}

const ogImageUrl = siteUrl + "assets/og-image.png";

let html = fs.readFileSync(indexPath, "utf8");
let replacements = 0;

function replaceOne(pattern, replacement) {
  const before = html;
  html = html.replace(pattern, replacement);
  if (html !== before) replacements++;
}

replaceOne(
  /<link rel="canonical" href="[^"]*">/,
  `<link rel="canonical" href="${siteUrl}">`
);
replaceOne(
  /<meta property="og:url" content="[^"]*">/,
  `<meta property="og:url" content="${siteUrl}">`
);
replaceOne(
  /<meta property="og:image" content="[^"]*">/,
  `<meta property="og:image" content="${ogImageUrl}">`
);
replaceOne(
  /<meta name="twitter:image" content="[^"]*">/,
  `<meta name="twitter:image" content="${ogImageUrl}">`
);

if (replacements !== 4) {
  console.error(`Expected 4 replacements, made ${replacements}. Check index.html's meta block hasn't drifted from the expected tag shapes.`);
  process.exit(1);
}

fs.writeFileSync(indexPath, html);
console.log(`index.html updated from site.config.json:`);
console.log(`  canonical / og:url -> ${siteUrl}`);
console.log(`  og:image / twitter:image -> ${ogImageUrl}`);
