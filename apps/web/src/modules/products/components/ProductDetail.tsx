'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
  Product,
  BundleItem,
} from '@core/data/supabase/products/products.repository';
import { Label } from '@soybelumont/ui/components/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@soybelumont/ui/components/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@soybelumont/ui/components/select';
import { Button } from '@soybelumont/ui/components/button';
import { Badge } from '@soybelumont/ui/components/badge';
import { formatPrice } from '@core/utils';
import ProductGallery from './ProductGallery';
import { Package, Check } from 'lucide-react';

interface ProductDetailsProps {
  product: Product & { colors?: string[]; sizes?: string[]; quantity?: number };
  bundleItems?: BundleItem[];
}

function ProductDetail({ product, bundleItems = [] }: ProductDetailsProps) {
  const t = useTranslations('PRODUCT');
  const isBundle = product.product_type === 'bundle';

  return (
    <section className="px-6 my-12 bg-gray-100 rounded-md md:px-6 lg:px-8 dark:bg-gray-800 md:mx-6 lg:mx-12 xl:mx-28 2xl:mx-48">
      <div className="py-8">
        <div className="grid items-start gap-24 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <ProductGallery
              images={[product.image_url, ...(product.product_images || [])]}
            />
          </div>
          <div className="order-1 space-y-6 md:order-2">
            <div>
              {isBundle && (
                <Badge className="mb-2 bg-orange-500 hover:bg-orange-600">
                  <Package className="w-3 h-3 mr-1" />
                  Pack
                </Badge>
              )}
              <h1 className="text-3xl font-bold md:text-4xl">{product.name}</h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {product.description}
              </p>
            </div>

            {/* Bundle items section */}
            {isBundle && bundleItems.length > 0 && (
              <div className="p-4 bg-white rounded-lg dark:bg-gray-900">
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                  Este pack incluye:
                </h3>
                <ul className="space-y-3">
                  {bundleItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 overflow-hidden rounded-md shrink-0">
                        <Image
                          src={item.product.thumbnail_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate dark:text-gray-100">
                          {item.product.name}
                        </p>
                      </div>
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
            </div>
            <form className="space-y-4">
              {product.colors && (
                <div>
                  <Label htmlFor="color" className="text-base font-medium">
                    Color
                  </Label>
                  <RadioGroup
                    id="color"
                    defaultValue="black"
                    className="flex items-center gap-2"
                  >
                    {product.colors.map((color) => (
                      <Label
                        key={color}
                        htmlFor="color-black"
                        className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
                      >
                        <RadioGroupItem id="color-black" value="black" />
                        {color}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}
              {product.sizes && (
                <div>
                  <Label htmlFor="size" className="text-base font-medium">
                    Size
                  </Label>
                  <RadioGroup
                    id="size"
                    defaultValue="m"
                    className="flex items-center gap-2"
                  >
                    {product.sizes.map((size) => (
                      <Label
                        key={size}
                        htmlFor="size-xs"
                        className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
                      >
                        <RadioGroupItem id="size-xs" value="xs" />
                        {size}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}
              {product.quantity && (
                <div>
                  <Label htmlFor="quantity" className="text-base font-medium">
                    Quantity
                  </Label>
                  <Select defaultValue="1">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: product.quantity },
                        (_, i) => i + 1
                      ).map((quantity) => (
                        <SelectItem key={quantity} value={quantity.toString()}>
                          {quantity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Link href={`/detalle-de-compra?productId=${product.id}`}>
                <Button size="lg">{t('BUY')}</Button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
