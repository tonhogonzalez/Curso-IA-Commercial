/**
 * PWA Icon Generator for Curso IA Commercial
 * Generates PNG icons from SVG template at all required sizes.
 * Run with: node scripts/generate-icons.js
 * 
 * NOTE: If you don't have 'sharp' installed, the script falls back
 * to creating SVG files that can be converted manually or with any
 * SVG-to-PNG tool. For production, install sharp: npm i sharp
 */

const fs = require('fs');
const path = require('path');

const SIZES = [48, 72, 96, 128, 144, 192, 256, 384, 512];
const OUTPUT_DIR = path.join(__dirname, '..', 'icons');

// SVG template for the icon - a clean "IA" logo with gradient background
function generateSVG(size) {
  const fontSize = Math.round(size * 0.38);
  const subFontSize = Math.round(size * 0.12);
  const r = Math.round(size * 0.18);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6"/>
      <stop offset="50%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.25)"/>
      <stop offset="50%" style="stop-color:rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#shine)"/>
  <text x="50%" y="48%" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="${fontSize}" font-weight="800" fill="white" text-anchor="middle" dominant-baseline="central">IA</text>
  <text x="50%" y="78%" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="${subFontSize}" font-weight="600" fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="central">CURSO</text>
</svg>`;
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Try to use sharp for PNG conversion, fallback to SVG
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  sharp = null;
}

async function generate() {
  for (const size of SIZES) {
    const svgContent = generateSVG(size);
    const svgPath = path.join(OUTPUT_DIR, `icon-${size}.svg`);
    const pngPath = path.join(OUTPUT_DIR, `icon-${size}.png`);

    if (sharp) {
      // Generate PNG from SVG using sharp
      await sharp(Buffer.from(svgContent))
        .png()
        .toFile(pngPath);
      console.log(`✓ Generated ${pngPath} (${size}x${size})`);
    } else {
      // Fallback: save SVG files
      fs.writeFileSync(svgPath, svgContent);
      console.log(`✓ Generated ${svgPath} (${size}x${size}) — SVG fallback`);
    }
  }

  if (!sharp) {
    console.log('\n⚠️  sharp no está instalado. Se generaron SVGs en lugar de PNGs.');
    console.log('   Para PNGs: npm i sharp && node scripts/generate-icons.js');
    console.log('   O convierte los SVGs manualmente con cualquier herramienta.');
  }
  
  console.log('\n✅ Iconos generados en:', OUTPUT_DIR);
}

generate().catch(console.error);
