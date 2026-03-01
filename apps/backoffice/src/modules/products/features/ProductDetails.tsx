'use client';

import React from 'react';
import { ProductHeader } from './ProductHeader';
import { ProductForm } from './ProductForm';
import { ProductImageManager } from './ProductImageManager';
import { PdfManager } from './ProductPdfManager';
import { BundleItemsManager } from './BundleItemsManager';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@soybelumont/ui/components/card';
import { useTranslations } from 'next-intl';
import { useProductSelected } from '../contexts/product-selected-context';

function ProductDetails() {
  const t = useTranslations();
  const { product } = useProductSelected();
  const isBundle = product.product_type === 'bundle';

  return (
    <div className="space-y-6">
      <ProductHeader />

      {/* Product Info */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          {t('PRODUCTS.PRODUCT_INFO_TITLE')}
        </h2>
        <ProductForm />
      </section>

      {/* Images */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          {t('PRODUCTS.IMAGES_TITLE')}
        </h2>
        <Card>
          <CardContent className="pt-6">
            <ProductImageManager />
          </CardContent>
        </Card>
      </section>

      {/* PDF — single products only */}
      {!isBundle && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            {t('PRODUCTS.PDF_TITLE')}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <PdfManager />
            </CardContent>
          </Card>
        </section>
      )}

      {/* Bundle items — bundle products only */}
      {isBundle && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            {t('PRODUCTS.BUNDLE_ITEMS_TITLE')}
          </h2>
          <BundleItemsManager />
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
