const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'assets', 'img');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="48" fill="#F5C400"/>
  <path d="M30 75 L50 25 L70 75 M37 58 L63 58" stroke="#0A0A0A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

fs.writeFileSync(path.join(imgDir, 'logo.svg'), svgLogo);
fs.writeFileSync(path.join(imgDir, 'favicon.svg'), svgLogo);

for (let i = 1; i <= 10; i++) {
  const partnerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
    <rect width="200" height="60" fill="#F8F8F8"/>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#0A0A0A">PARTNER ${i}</text>
  </svg>`;
  fs.writeFileSync(path.join(imgDir, `partner-${i}.svg`), partnerSvg);
}

function makeSvgImage(filename, width, height, title, bgColor = '#1A1A1A') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 40 M 0 0 L 40 40" fill="none" stroke="rgba(245,196,0,0.08)" stroke-width="1"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <rect x="20" y="${height - 70}" width="${width - 40}" height="50" rx="8" fill="#0A0A0A" opacity="0.85"/>
    <text x="40" y="${height - 38}" font-family="sans-serif" font-weight="bold" font-size="20" fill="#F5C400">${title}</text>
  </svg>`;
  fs.writeFileSync(path.join(imgDir, filename), svg);
}

makeSvgImage('hero.jpg', 1920, 1080, 'Aparajita Engicon Construction Site');
makeSvgImage('about-1.jpg', 600, 600, 'Commercial Site Operations');
makeSvgImage('about-2.jpg', 600, 800, 'Lead Structural Engineer');
makeSvgImage('faq.jpg', 600, 750, 'Site Consultation & Feasibility');
makeSvgImage('og-image.jpg', 1200, 630, 'Aparajita Engicon Pvt Ltd');

for (let i = 1; i <= 6; i++) makeSvgImage(`service-${i}.jpg`, 600, 800, `Service Project ${i}`);
for (let i = 1; i <= 3; i++) makeSvgImage(`exp-${i}.jpg`, 800, 600, `Experience Showcase ${i}`);
for (let i = 1; i <= 7; i++) makeSvgImage(`team-${i}.jpg`, 400, 480, `Team Member ${i}`, '#F5C400');
for (let i = 1; i <= 3; i++) makeSvgImage(`news-${i}.jpg`, 600, 450, `Construction Insight ${i}`);
for (let i = 1; i <= 3; i++) makeSvgImage(`avatar-${i}.jpg`, 100, 100, `Client ${i}`, '#333333');

console.log('All image assets generated!');
