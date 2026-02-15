import type { Metadata } from 'next';
import Container from '@soybelumont/ui/layouts/container';
import { ProductsRepository } from '@core/data/supabase/products';

import ProductCard from '../../modules/products/components/ProductCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Recetarios de Cocina Saludable',
  description:
    'Explorá todos los recetarios de cocina saludable de Belu Mont. Recetas fáciles, nutritivas y deliciosas para cada día.',
  openGraph: {
    title: 'Recetarios de Cocina Saludable | Belu Mont',
    description:
      'Explorá todos los recetarios de cocina saludable de Belu Mont. Recetas fáciles, nutritivas y deliciosas para cada día.',
  },
};

export default async function ProductsPage() {
  const products = await ProductsRepository().getAll();

  console.log('Products:', products);
  return (
    <Container>
      <div className='min-h-[calc(100vh-80px-32px)]'>
        <h1 className='my-8 text-4xl font-bold lg:text-5xl'>Recetarios</h1>
        <div className="grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Container>
  );
}
