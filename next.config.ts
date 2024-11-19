import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  i18n: { locales: ['es'], defaultLocale: 'es' },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: String(process.env.SUPABASE_DOMAIN),
      },
    ],
  },
};

export default nextConfig;
