#!/usr/bin/env node
// Generates the print QR code for the flyer from the landing page's
// final URL. Usage:
//
//   node qr/generate-qr.js https://spanish-with-franco.example/
//
// With no argument, falls back to a placeholder URL — replace it with
// the real deployed URL before printing anything.
//
// Outputs, both into /qr:
//   qr-code.svg   — vector, use this on the flyer
//   qr-code.png   — 2000px raster, for previewing only; never scale
//                   this up for print (see README.md in this folder)

const path = require("path");
const QRCode = require("qrcode");

const DEFAULT_URL = "https://spanish-with-franco.example/";
const url = process.argv[2] || DEFAULT_URL;

if (!process.argv[2]) {
  console.warn(`No URL given — using placeholder: ${DEFAULT_URL}`);
  console.warn("Re-run with the real deployed URL before printing.\n");
}

const options = {
  errorCorrectionLevel: "H",
  type: "svg",
  margin: 4, // quiet zone, in modules
  color: {
    dark: "#000000",
    light: "#FFFFFF",
  },
};

const svgPath = path.join(__dirname, "qr-code.svg");
const pngPath = path.join(__dirname, "qr-code.png");

QRCode.toFile(svgPath, url, options)
  .then(() => {
    console.log(`SVG written: ${svgPath}`);
    return QRCode.toFile(pngPath, url, {
      ...options,
      type: "png",
      width: 2000,
    });
  })
  .then(() => {
    console.log(`PNG written: ${pngPath} (2000px)`);
    console.log(`\nEncoded URL: ${url}`);
  })
  .catch((err) => {
    console.error("QR generation failed:", err);
    process.exitCode = 1;
  });
