const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  turbopack: {}, // Enable Turbopack builds (beta)
  typedRoutes: true, // Type-safe routing

  // Exclude test files from pages
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(
    ext => !['test', 'spec', 'setup'].includes(ext.split('.')[0])
  ),

  // Existing configuration
  transpilePackages: ['@make-the-change/shared'],

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Image optimizations (15.3+ improvements)
  images: {
    formats: ['image/avif', 'image/webp'],
    // Activer l'optimisation pour de meilleures performances
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ebmjxinsyyjwshnynwwu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Ajouter d'autres domaines Supabase si nécessaire
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Fallback pour compatibilité
    domains: [
      'images.unsplash.com',
      'ebmjxinsyyjwshnynwwu.supabase.co',
      // Ajout de domaines génériques
      'supabase.co',
    ],
  },

  // Webpack configuration
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    // Exclude test files from build
    config.module.rules.push({
      test: /\.test\.|\.spec\.|\.setup\./,
      loader: 'ignore-loader',
    });

    return config;
  },
};

module.exports = withNextIntl(nextConfig);
