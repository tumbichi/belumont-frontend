import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.soybelumont.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/pago/', '/detalle-de-compra'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
