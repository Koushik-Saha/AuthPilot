const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brandDir = path.join(__dirname, '..', 'public', 'brand');
const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(brandDir)) {
  fs.mkdirSync(brandDir, { recursive: true });
}

// Helper SVG template for Logo Icon symbol
function getIconSvg(size = 512) {
  const scale = size / 512;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="512" height="512" fill="#0A1628" />

      <!-- Centered rounded square -->
      <rect x="66" y="66" width="380" height="380" rx="80" fill="#0F2040" stroke="#2DD4BF" stroke-width="2" stroke-opacity="0.4" />

      <!-- Plus Symbol -->
      <!-- Horizontal bar -->
      <rect x="176" y="232" width="160" height="18" rx="9" fill="#2DD4BF" />
      <!-- Vertical bar -->
      <rect x="247" y="196" width="18" height="90" rx="9" fill="#2DD4BF" />

      <!-- Curved checkmark arc (Authorization Approved) -->
      <path d="M 215 255 L 255 295 L 335 205" fill="none" stroke="#2DD4BF" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Small text below symbol -->
      <text x="256" y="412" text-anchor="middle" fill="#2DD4BF" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="22" letter-spacing="8">AUTH</text>
    </svg>
  `;
}

// SVG template for Full / Dark Logo
function getFullLogoSvg(width = 1200, height = 400) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="1200" height="400" fill="#0A1628" />

      <!-- Icon on Left -->
      <g transform="translate(100, 100)">
        <rect width="200" height="200" rx="42" fill="#0F2040" stroke="#2DD4BF" stroke-width="2" stroke-opacity="0.4" />
        <rect x="52" y="91" width="96" height="18" rx="9" fill="#2DD4BF" />
        <rect x="91" y="52" width="18" height="96" rx="9" fill="#2DD4BF" />
        <path d="M 75 98 L 98 122 L 145 70" fill="none" stroke="#2DD4BF" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
        <text x="100" y="180" text-anchor="middle" fill="#2DD4BF" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14" letter-spacing="5">AUTH</text>
      </g>

      <!-- Wordmark on Right -->
      <text x="340" y="210" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="104">
        <tspan fill="#F0F6FC">Auth</tspan><tspan fill="#2DD4BF">Pilot</tspan>
      </text>

      <!-- Subtitle -->
      <text x="344" y="260" fill="#8B98A8" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="28" letter-spacing="0.5">
        Prior Authorization AI
      </text>
    </svg>
  `;
}

// SVG template for Open Graph Image
function getOgImageSvg(width = 1200, height = 630) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="1200" height="630" fill="#0A1628" />

      <!-- Subtle background ambient glow -->
      <circle cx="600" cy="200" r="300" fill="#0F2040" opacity="0.6" />
      <circle cx="900" cy="450" r="200" fill="#162035" opacity="0.4" />

      <!-- Top Header / Icon + Logo -->
      <g transform="translate(180, 120)">
        <g transform="translate(0, 0)">
          <rect width="100" height="100" rx="22" fill="#0F2040" stroke="#2DD4BF" stroke-width="2" stroke-opacity="0.4" />
          <rect x="26" y="46" width="48" height="9" rx="4.5" fill="#2DD4BF" />
          <rect x="45.5" y="26" width="9" height="48" rx="4.5" fill="#2DD4BF" />
          <path d="M 37 49 L 49 61 L 73 35" fill="none" stroke="#2DD4BF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
          <text x="50" y="90" text-anchor="middle" fill="#2DD4BF" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="8" letter-spacing="3">AUTH</text>
        </g>

        <text x="130" y="70" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="72">
          <tspan fill="#F0F6FC">Auth</tspan><tspan fill="#2DD4BF">Pilot</tspan>
        </text>
      </g>

      <!-- Main Title / Subtitle -->
      <text x="600" y="300" text-anchor="middle" fill="#F0F6FC" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="38">
        AI Prior Authorization for Home Care Agencies
      </text>

      <text x="600" y="348" text-anchor="middle" fill="#8B98A8" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="22">
        Instant clinical data extraction, STAR+PLUS form generation &amp; denial prevention
      </text>

      <!-- 3 Stats Cards Row -->
      <g transform="translate(150, 420)">
        <!-- Stat 1 -->
        <g transform="translate(0, 0)">
          <rect width="270" height="90" rx="16" fill="#0F2040" stroke="#1E3050" stroke-width="1.5" />
          <text x="135" y="42" text-anchor="middle" fill="#2DD4BF" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="28">90 sec</text>
          <text x="135" y="68" text-anchor="middle" fill="#8B98A8" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="14">per PA submission</text>
        </g>

        <!-- Stat 2 -->
        <g transform="translate(315, 0)">
          <rect width="270" height="90" rx="16" fill="#0F2040" stroke="#1E3050" stroke-width="1.5" />
          <text x="135" y="42" text-anchor="middle" fill="#2DD4BF" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="28">40% fewer</text>
          <text x="135" y="68" text-anchor="middle" fill="#8B98A8" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="14">initial PA denials</text>
        </g>

        <!-- Stat 3 -->
        <g transform="translate(630, 0)">
          <rect width="270" height="90" rx="16" fill="#0F2040" stroke="#1E3050" stroke-width="1.5" />
          <text x="135" y="42" text-anchor="middle" fill="#2DD4BF" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="28">Jan 2027</text>
          <text x="135" y="68" text-anchor="middle" fill="#8B98A8" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="14">CMS rule ready</text>
        </g>
      </g>

      <!-- Bottom Teal Accent Line -->
      <rect x="0" y="622" width="1200" height="8" fill="#2DD4BF" />
    </svg>
  `;
}

async function generateAssets() {
  console.log('Generating brand assets...');

  // 1. logo-icon.png (512x512)
  const iconBuffer = Buffer.from(getIconSvg(512));
  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(brandDir, 'logo-icon.png'));
  console.log('✓ Generated logo-icon.png (512x512)');

  // 2. logo-full.png (1200x400)
  const fullLogoBuffer = Buffer.from(getFullLogoSvg(1200, 400));
  await sharp(fullLogoBuffer)
    .resize(1200, 400)
    .png()
    .toFile(path.join(brandDir, 'logo-full.png'));
  console.log('✓ Generated logo-full.png (1200x400)');

  // 3. logo-dark.png (1200x400)
  await sharp(fullLogoBuffer)
    .resize(1200, 400)
    .png()
    .toFile(path.join(brandDir, 'logo-dark.png'));
  console.log('✓ Generated logo-dark.png (1200x400)');

  // 4. og-image.png (1200x630)
  const ogBuffer = Buffer.from(getOgImageSvg(1200, 630));
  await sharp(ogBuffer)
    .resize(1200, 630)
    .png()
    .toFile(path.join(brandDir, 'og-image.png'));
  console.log('✓ Generated og-image.png (1200x630)');

  // 5. favicon.ico (32x32)
  const faviconBuffer = Buffer.from(getIconSvg(32));
  await sharp(faviconBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(brandDir, 'favicon.ico'));
  
  // Copy to public root as well
  fs.copyFileSync(path.join(brandDir, 'favicon.ico'), path.join(publicDir, 'favicon.ico'));
  console.log('✓ Generated favicon.ico (32x32)');

  console.log('All brand assets successfully generated in public/brand/');
}

generateAssets().catch((err) => {
  console.error('Error generating brand assets:', err);
  process.exit(1);
});
