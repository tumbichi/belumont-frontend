import Container from '@soybelumont/ui/layouts/container';
import { ProductsRepository } from '@core/data/supabase/products';

import ProductCard from '../../modules/products/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await ProductsRepository().getAll();
  return (
    <Container>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
}
