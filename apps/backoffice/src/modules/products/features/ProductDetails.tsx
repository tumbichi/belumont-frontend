'use client';

import React from 'react';
import { Separator } from '@soybelumont/ui/components/separator';
import { ProductHeader } from './ProductHeader';
import { ProductForm } from './ProductForm';
import { ProductImageManager } from './ProductImageManager';
import { PdfManager } from './ProductPdfManager';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@soybelumont/ui/components/tabs';
import { useTranslations } from 'next-intl';

function ProductDetails() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      <main className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Tabs defaultValue="product_info">
            <TabsList className="mb-4">
              <TabsTrigger value="product_info">
                {t('PRODUCTS.PRODUCT_INFO_TAB')}
              </TabsTrigger>
              <TabsTrigger value="images">
                {t('PRODUCTS.IMAGES_TAB')}
              </TabsTrigger>
              <TabsTrigger value="pdfs">{t('PRODUCTS.PDF_TAB')}</TabsTrigger>
            </TabsList>

            {/* Product Information Section */}
            <TabsContent value="product_info">
              <section>
                <h2 className="mb-6 text-2xl font-bold">
                  {t('PRODUCTS.PRODUCT_INFO_TITLE')}
                </h2>
                <ProductForm />
              </section>
            </TabsContent>

            <Separator />

            {/* Images Management Section */}
            <TabsContent value="images">
              <section>
                <h2 className="mb-6 text-2xl font-bold">
                  {t('PRODUCTS.IMAGES_TITLE')}
                </h2>
                <ProductImageManager />
              </section>
            </TabsContent>
            <Separator />

            {/* PDF Management Section */}
            <TabsContent value="pdfs">
              <section>
                <h2 className="mb-6 text-2xl font-bold">
                  {t('PRODUCTS.PDF_TITLE')}
                </h2>
                <PdfManager />
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;
