/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  
  // Otimizações para produção
  swcMinify: true,
  
  // Configuração de imagens (remotePatterns substitui domains depreciado no Next)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "vivantcapital.com.br", pathname: "/**" },
      { protocol: "https", hostname: "vivantresidences.com.br", pathname: "/**" },
      { protocol: "https", hostname: "vivantcare.com.br", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
    ],
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
      // Em desenvolvimento, evitar cache agressivo dos chunks do Next
      // para não precisar de Ctrl+F5 após alterações.
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isProd
              ? 'public, max-age=31536000, immutable'
              : 'no-store, no-cache, must-revalidate, max-age=0',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Permite carregar assets de qualquer domínio
          },
        ],
      },
    ];
  },

  webpack: (config, { dev }) => {
    // Em ambiente de desenvolvimento local (Windows + OneDrive),
    // o cache de filesystem do webpack pode corromper vendor-chunks
    // e causar erros intermitentes ao navegar (ex.: logout -> login).
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
