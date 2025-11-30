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

function ProductDetails() {
  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      <main className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Tabs defaultValue="product_info">
            <TabsList className="mb-4">
              <TabsTrigger value="product_info">Info del Producto</TabsTrigger>
              <TabsTrigger value="images">Imagenes</TabsTrigger>
              <TabsTrigger value="pdfs">Archivo PDF</TabsTrigger>
            </TabsList>
            {/* Product Information Section */}
            <TabsContent value="product_info">
              <section>
                <h2 className="mb-6 text-2xl font-bold">Product Information</h2>
                <ProductForm />
              </section>
            </TabsContent>

            <Separator />

            {/* Images Management Section */}
            <TabsContent value="images">
              <section>
                <h2 className="mb-6 text-2xl font-bold">Images</h2>
                <ProductImageManager />
              </section>
            </TabsContent>
            <Separator />

            {/* PDF Management Section */}
            <TabsContent value="pdfs">
              <section>
                <h2 className="mb-6 text-2xl font-bold">Downloadable Files</h2>
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
