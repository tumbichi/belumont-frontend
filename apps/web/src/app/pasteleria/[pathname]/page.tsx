import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@soybelumont/ui/layouts/container';
import { PatisserieRepository } from '@core/data/supabase/patisserie';
import { PatisserieProductDetail } from '../../../modules/patisserie/features/PatisserieProductDetail';
import { PatisserieCheckout } from '../../../modules/patisserie/features/PatisserieCheckout';

interface PatisserieProductPageProps {
  params: Promise<{ pathname: string }>;
}

export async function generateMetadata({
  params,
}: PatisserieProductPageProps): Promise<Metadata> {
  const { pathname } = await params;
  const product = await PatisserieRepository().getByPathname(pathname);

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  const description =
    product.description ||
    `${product.name} — Pastelería artesanal 100% Sin TACC. Retiro en Baradero.`;

  return {
    title: `${product.name} — Pastelería Sin TACC`,
    description,
    openGraph: {
      title: `${product.name} | Belu Mont Pastelería`,
      description,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
  };
}

export default async function PatisserieProductPage({
  params,
}: PatisserieProductPageProps) {
  const { pathname } = await params;
  const product = await PatisserieRepository().getByPathname(pathname);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Container>
        <PatisserieProductDetail product={product} />
      </Container>
      <PatisserieCheckout />
    </main>
  );
}
