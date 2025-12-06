import ProductsList from '@modules/products/features/ProductsList';
import ProductsPageLayout from '@modules/products/layouts/products-page.layout';
import { Button } from '@soybelumont/ui/components/button';
import { BookPlus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ProductsPage() {
  const t = await getTranslations();
  
  return (
    <ProductsPageLayout>
      {{
        header: (
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t('PRODUCTS.TITLE')}</h1>
            <Button>
              <BookPlus />
              {t('PRODUCTS.CREATE_PRODUCT')}
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
