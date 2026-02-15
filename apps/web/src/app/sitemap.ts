import type { MetadataRoute } from 'next';
import { ProductsRepository } from '@core/data/supabase/products';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.soybelumont.com';

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  },
  {
    url: `${BASE_URL}/recetarios`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const products = await ProductsRepository().getAll();

    const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${BASE_URL}/recetarios/${product.pathname}`,
      lastModified: product.updated_at,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...productUrls];
  } catch {
    return staticRoutes;
  }
}
