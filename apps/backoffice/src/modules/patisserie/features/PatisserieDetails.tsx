'use client';

import React from 'react';
import { PatisserieHeader } from './PatisserieHeader';
import { PatisserieForm } from './PatisserieForm';
import { PatisserieImageManager } from './PatisserieImageManager';
import { Card, CardContent } from '@soybelumont/ui/components/card';
import { useTranslations } from 'next-intl';

function PatisserieDetails() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <PatisserieHeader />

      {/* Product Info */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          {t('PATISSERIE.PRODUCT_INFO_TITLE')}
        </h2>
        <PatisserieForm />
      </section>

      {/* Images */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          {t('PATISSERIE.IMAGES_TITLE')}
        </h2>
        <Card>
          <CardContent className="pt-6">
            <PatisserieImageManager />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default PatisserieDetails;
