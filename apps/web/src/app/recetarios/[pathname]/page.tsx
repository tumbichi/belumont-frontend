import type { Metadata } from 'next';
import Container from '@soybelumont/ui/layouts/container';
import { ProductsRepository } from '@core/data/supabase/products';
import ProductDetail from '../../../modules/products/components/ProductDetail';
import Error from '../error';

interface ProductDetailsPageProps {
  params: Promise<{ pathname: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const productPathname = (await params).pathname;
  const product = await ProductsRepository().getByPathname(productPathname);

  if (!product) {
    return {
      title: 'Recetario no encontrado',
    };
  }

  const title = product.name;
  const description =
    product.description ||
    `Recetario de cocina saludable: ${product.name}. Comprá tu recetario digital de Belu Mont.`;

  return {
    title,
    description,
    openGraph: {
      title: `${product.name} | Belu Mont`,
      description,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Belu Mont`,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const productPathname = (await params).pathname;
  const productsRepo = ProductsRepository();
  const product = await productsRepo.getByPathname(productPathname);

  if (!product) {
    return <Error />;
  }

  // If it's a bundle, fetch the bundle items
  const bundleItems =
    product.product_type === 'bundle'
      ? await productsRepo.getBundleItems(product.id)
      : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description:
      product.description ||
      `Recetario de cocina saludable: ${product.name}`,
    image: product.image_url,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
    },
    brand: {
      '@type': 'Brand',
      name: 'Belu Mont',
    },
  };

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} bundleItems={bundleItems} />
    </Container>
  );
}
