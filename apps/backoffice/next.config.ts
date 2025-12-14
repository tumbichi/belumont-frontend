import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/core/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: String(process.env.SUPABASE_DOMAIN),
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1'
      }
    ],
  },
};

export default withNextIntl(nextConfig);
