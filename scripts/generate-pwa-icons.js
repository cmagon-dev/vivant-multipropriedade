const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Cores da Vivant Care
const VIVANT_GREEN = '#10B981';
const VIVANT_NAVY = '#1A2F4B';

// Criar um ícone simples SVG
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${VIVANT_GREEN};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0D9488;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  
  <!-- Logo V -->
  <g transform="translate(${size * 0.3}, ${size * 0.25})">
    <path d="M 0 0 L ${size * 0.15} ${size * 0.4} L ${size * 0.3} 0 L ${size * 0.4} 0 L ${size * 0.15} ${size * 0.5} L 0 0" 
          fill="white" 
          stroke="white" 
          stroke-width="${size * 0.02}"/>
  </g>
  
  <!-- Care text (apenas em tamanhos maiores) -->
  ${size >= 192 ? `
    <text x="50%" y="75%" 
          font-family="Arial, sans-serif" 
          font-size="${size * 0.1}" 
          font-weight="bold" 
          fill="white" 
          text-anchor="middle">
      CARE
    </text>
  ` : ''}
</svg>
`;

async function generateIcons() {
  console.log('🎨 Gerando ícones PWA...\n');

  const sizes = [
    { size: 72, name: 'icon-72x72.png' },
    { size: 96, name: 'icon-96x96.png' },
    { size: 128, name: 'icon-128x128.png' },
    { size: 144, name: 'icon-144x144.png' },
    { size: 152, name: 'icon-152x152.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 384, name: 'icon-384x384.png' },
    { size: 512, name: 'icon-512x512.png' },
  ];

  // Apple touch icons
  const appleIcons = [
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 167, name: 'apple-touch-icon-ipad.png' },
  ];

  const publicDir = path.join(process.cwd(), 'public');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Gerar ícones PWA
  for (const { size, name } of sizes) {
    const svg = createIconSVG(size);
    const outputPath = path.join(publicDir, name);
    
    try {
      await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ ${name} gerado com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao gerar ${name}:`, error.message);
    }
  }

  // Gerar ícones Apple
  for (const { size, name } of appleIcons) {
    const svg = createIconSVG(size);
    const outputPath = path.join(publicDir, name);
    
    try {
      await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ ${name} gerado com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao gerar ${name}:`, error.message);
    }
  }

  // Gerar favicon
  const faviconSvg = createIconSVG(32);
  const faviconPath = path.join(publicDir, 'favicon.ico');
  
  try {
    await sharp(Buffer.from(faviconSvg))
      .resize(32, 32)
      .png()
      .toFile(faviconPath);
    
    console.log(`✅ favicon.ico gerado com sucesso!`);
  } catch (error) {
    console.error(`❌ Erro ao gerar favicon:`, error.message);
  }

  console.log('\n✨ Todos os ícones foram gerados com sucesso!');
  console.log('\n📁 Arquivos criados em /public:');
  console.log('   - icon-192x192.png');
  console.log('   - icon-512x512.png');
  console.log('   - apple-touch-icon.png');
  console.log('   - favicon.ico');
  console.log('   - e mais 6 tamanhos adicionais\n');
}

// Verificar se sharp está instalado
try {
  require.resolve('sharp');
  generateIcons();
} catch (e) {
  console.log('📦 Instalando dependência "sharp"...\n');
  const { execSync } = require('child_process');
  execSync('npm install sharp --save-dev', { stdio: 'inherit' });
  console.log('\n✅ Sharp instalado! Executando geração de ícones...\n');
  generateIcons();
}
