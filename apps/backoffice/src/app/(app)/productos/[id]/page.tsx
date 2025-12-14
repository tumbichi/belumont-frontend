import ProductDetails from '@modules/products/features/ProductDetails';
import ProductsPageLayout from '@modules/products/layouts/products-page.layout';
import React from 'react';
import { Button } from '@soybelumont/ui/components/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Product, ProductsRepository } from '@core/data/supabase/products';
import { ProductSelectedProvider } from '@modules/products/contexts/product-selected-context';
import { getTranslations } from 'next-intl/server';

async function getProduct(id: string): Promise<Product | null> {
  const repository = ProductsRepository();
  const product = await repository.getById(id);

  return product;
}

async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations();
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    throw new Error(t('PRODUCTS.PRODUCT_NOT_FOUND'));
  }

  return (
    <ProductSelectedProvider product={product}>
      <ProductsPageLayout>
        {{
          header: (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link href="/productos">
                  <Button variant="outline" size="icon">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">{t('PRODUCTS.PRODUCT_DETAILS')}: {id}</h1>
                  <p className="text-gray-500">{t('PRODUCTS.MANAGE_DETAILS')}</p>
                </div>
              </div>
            </div>
          ),
          content: <ProductDetails />,
        }}
      </ProductsPageLayout>
    </ProductSelectedProvider>
  );
}

export default ProductDetailsPage;
