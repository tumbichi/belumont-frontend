import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@soybelumont/ui/components/card';
import { Product } from '../../../core/data/supabase/products/products.repository';
import { formatPrice } from '@core/utils';
import { Separator } from '@soybelumont/ui/components/separator';

interface ProductItemListProps {
  product: Product;
}

const ProductItemList = ({ product }: ProductItemListProps) => (
  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
    <Image
      src={product.image_url}
      width={64}
      height={64}
      alt="Product Image"
      className="rounded-md"
      style={{ aspectRatio: '64/64', objectFit: 'cover' }}
    />
    <div>
      <div className="font-medium">{product.name}</div>
      {/* <div className="text-sm text-gray-500 dark:text-gray-400">Color: Navy Blue</div> */}
    </div>
    <div className="text-right">
      <div className="font-medium">{formatPrice(product.price)}</div>
      {/* <div className="text-sm text-gray-500 dark:text-gray-400">Qty: 1</div> */}
    </div>
  </div>
);

export default function OrderSummary({ product }: ProductItemListProps) {
  const t = useTranslations('ORDER_SUMMARY');

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>{t('TITLE')}</CardTitle>
          <CardDescription>{t('DESCRIPTION')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductItemList product={product} />
        </CardContent>
      </div>
      <CardFooter className="flex flex-col ">
        <Separator />
        <div className="flex items-center justify-between w-full mt-4">
          <div className="text-lg font-semibold">{t('TOTAL')}</div>
          <div className="text-xl font-semibold">
            {formatPrice(product.price)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
