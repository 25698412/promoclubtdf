/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita el pre-render estático de páginas que dependen de Supabase
  // (las variables de entorno de Supabase se inyectan en runtime en Vercel/VPS)
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Deshabilita el export estático de páginas con dependencias de runtime
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
