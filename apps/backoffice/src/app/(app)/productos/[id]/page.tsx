import ProductDetails from '@modules/products/features/ProductDetails';
import React from 'react';
import { Button } from '@soybelumont/ui/components/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Product, ProductsRepository } from '@core/data/supabase/products';
import { ProductSelectedProvider } from '@modules/products/contexts/product-selected-context';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

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
    notFound();
  }

  return (
    <ProductSelectedProvider product={product}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/productos">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{t('PRODUCTS.PRODUCT_DETAILS')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('PRODUCTS.MANAGE_DETAILS')}
            </p>
          </div>
        </div>
        <ProductDetails />
      </div>
    </ProductSelectedProvider>
  );
}

export default ProductDetailsPage;
