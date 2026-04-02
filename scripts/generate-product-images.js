const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'images', 'boutique');

// Product image configs: filename -> { type, label, colors }
const products = [
  // Maillots
  { file: 'maillot-domicile.jpg', type: 'jersey', label: 'MAILLOT\nDOMICILE', primary: '#012e24', accent: '#e4002b' },
  { file: 'maillot-exterieur.jpg', type: 'jersey', label: 'MAILLOT\nEXTÉRIEUR', primary: '#ffffff', accent: '#012e24', textColor: '#012e24' },
  { file: 'maillot-entrainement.jpg', type: 'jersey', label: 'MAILLOT\nENTRAÎNEMENT', primary: '#1a1a1a', accent: '#00664f' },
  // Textile
  { file: 'hoodie-vert.jpg', type: 'hoodie', label: 'HOODIE\nVERT', primary: '#012e24', accent: '#e4002b' },
  { file: 'hoodie-noir.jpg', type: 'hoodie', label: 'HOODIE\nNOIR', primary: '#111111', accent: '#012e24' },
  { file: 'tshirt-classique.jpg', type: 'tshirt', label: 'T-SHIRT\nCLASSIQUE', primary: '#012e24', accent: '#ffffff' },
  { file: 'polo-hormadi.jpg', type: 'polo', label: 'POLO\nHORMADI', primary: '#012e24', accent: '#e4002b' },
  { file: 'veste-softshell.jpg', type: 'jacket', label: 'VESTE\nSOFTSHELL', primary: '#012e24', accent: '#00664f' },
  { file: 'jogging-hormadi.jpg', type: 'pants', label: 'JOGGING\nHORMADI', primary: '#1a1a1a', accent: '#012e24' },
  // Accessoires
  { file: 'casquette.jpg', type: 'cap', label: 'CASQUETTE', primary: '#012e24', accent: '#e4002b' },
  { file: 'bonnet.jpg', type: 'beanie', label: 'BONNET', primary: '#012e24', accent: '#e4002b' },
  { file: 'echarpe.jpg', type: 'scarf', label: 'ÉCHARPE\nSUPPORTER', primary: '#012e24', accent: '#e4002b' },
  { file: 'mug.jpg', type: 'mug', label: 'MUG\nHORMADI', primary: '#ffffff', accent: '#012e24', textColor: '#012e24' },
  { file: 'sac-a-dos.jpg', type: 'bag', label: 'SAC À DOS', primary: '#1a1a1a', accent: '#012e24' },
  { file: 'gourde.jpg', type: 'bottle', label: 'GOURDE\nISOTHERME', primary: '#012e24', accent: '#e4002b' },
  { file: 'drapeau.jpg', type: 'flag', label: 'DRAPEAU\n150x90cm', primary: '#012e24', accent: '#e4002b' },
  { file: 'porte-cles.jpg', type: 'keychain', label: 'PORTE-CLÉS\nPALET', primary: '#1a1a1a', accent: '#012e24' },
  // Enfant
  { file: 'maillot-enfant.jpg', type: 'jersey', label: 'MAILLOT\nENFANT', primary: '#012e24', accent: '#e4002b' },
  { file: 'tshirt-enfant.jpg', type: 'tshirt', label: 'T-SHIRT\nENFANT', primary: '#012e24', accent: '#e4002b' },
  { file: 'peluche.jpg', type: 'plush', label: 'PELUCHE\nMASCOTTE', primary: '#00664f', accent: '#e4002b' },
  // Collectors
  { file: 'maillot-collector.jpg', type: 'jersey', label: 'COLLECTOR\n50 ANS', primary: '#0a0a0a', accent: '#d4af37' },
  { file: 'pack-supporter.jpg', type: 'pack', label: 'PACK\nSUPPORTER', primary: '#012e24', accent: '#e4002b' },
  { file: 'photo-equipe.jpg', type: 'frame', label: 'PHOTO\nÉQUIPE 2025', primary: '#2a1a0a', accent: '#d4af37' },
];

function generateSVG(product) {
  const { label, primary, accent, textColor } = product;
  const tc = textColor || '#ffffff';
  const lines = label.split('\n');
  
  // Create a nice product card SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${primary === '#ffffff' ? '#f0f0f0' : darken(primary)};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="800" fill="url(#bg)"/>
  
  <!-- Diagonal accent stripe -->
  <polygon points="0,500 300,0 450,0 0,600" fill="${accent}" opacity="0.08"/>
  <polygon points="500,800 800,300 800,450 600,800" fill="${accent}" opacity="0.06"/>
  
  <!-- Small accent line -->
  <rect x="50" y="680" width="80" height="4" rx="2" fill="${accent}"/>
  
  <!-- Hormadi logo circle -->
  <circle cx="400" cy="320" r="120" fill="${accent}" opacity="0.12"/>
  <text x="400" y="340" font-family="Arial Black, sans-serif" font-size="72" font-weight="900" fill="${accent}" opacity="0.25" text-anchor="middle">H</text>
  
  <!-- Product name -->
  ${lines.map((line, i) => 
    `<text x="50" y="${700 + i * 50}" font-family="Arial Black, sans-serif" font-size="42" font-weight="900" fill="${tc}" letter-spacing="2">${escapeXml(line)}</text>`
  ).join('\n  ')}
  
  <!-- Brand -->
  <text x="750" y="50" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${tc}" opacity="0.4" text-anchor="end" letter-spacing="3">HORMADI ANGLET</text>
</svg>`;

  return svg;
}

function darken(hex) {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 30);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 30);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 30);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Generate all
products.forEach(product => {
  const svg = generateSVG(product);
  // Save as SVG (browsers will display it fine for img src even with .jpg extension via Next.js)
  // Actually let's save as proper SVG and update product refs
  const svgFile = product.file.replace('.jpg', '.svg');
  fs.writeFileSync(path.join(outDir, svgFile), svg);
  console.log(`Created ${svgFile}`);
});

console.log(`\nDone! ${products.length} product images created.`);
