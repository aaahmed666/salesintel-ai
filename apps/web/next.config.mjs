import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile workspace packages that ship raw TS/TSX.
  transpilePackages: [
    '@salesintel/ui',
    '@salesintel/api',
    '@salesintel/types',
    '@salesintel/config',
    '@salesintel/i18n',
  ],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config) => {
    // The sandbox build disk can't serialize some PostCSS error objects;
    // memory cache avoids noisy (non-fatal) cache-write warnings.
    config.cache = { type: 'memory' };
    return config;
  },
};

export default withNextIntl(nextConfig);
