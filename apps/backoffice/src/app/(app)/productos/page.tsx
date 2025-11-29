import ProductsList from '@modules/products/features/ProductsList';
import ProductsPageLayout from '@modules/products/layouts/products-page.layout';
import { Button } from '@soybelumont/ui/components/button';
import { BookPlus } from 'lucide-react';

export default async function ProductsPage() {
  return (
    <ProductsPageLayout>
      {{
        header: (
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Productos</h1>
            <Button>
              <BookPlus />
              Crear Producto
            </Button>
          </div>
        ),
        content: (
          <div className="border rounded-lg">
            <ProductsList />
          </div>
        ),
      }}
    </ProductsPageLayout>
  );
}
