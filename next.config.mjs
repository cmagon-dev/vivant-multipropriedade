/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Otimizações para produção
  swcMinify: true,
  
  // Configuração de imagens (quando necessário)
  images: {
    domains: ['vivantcapital.com.br', 'vivantresidences.com.br', 'vivantcare.com.br', 'localhost'],
  },
  
  // Garantir que assets estáticos sejam servidos corretamente
  assetPrefix: undefined, // Usa caminho relativo, funciona com qualquer hostname
  
  // Headers de segurança e CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
      // Headers específicos para assets estáticos (CSS, JS, fontes)
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Permite carregar assets de qualquer domínio
          },
        ],
      },
    ];
  },
};

export default nextConfig;
