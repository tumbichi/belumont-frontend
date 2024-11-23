'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { Product } from '@core/data/supabase/products/products.repository';
import { Label } from '@core/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@core/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@core/components/ui/select';
import { Button } from '@core/components/ui/button';
import { formatPrice } from '@core/utils';
import { useToast } from '@core/hooks/use-toast';
import { Toaster } from '@core/components/ui/toaster';

interface ProductDetailsProps {
  product: Product & { colors?: string[]; sizes?: string[]; quantity?: number };
  paymentStatus?: 'pending' | 'failure';
}

function ProductDetails({ product, paymentStatus }: ProductDetailsProps) {
  const { toast } = useToast();
  const t = useTranslations('PRODUCT');

  useEffect(() => {
    switch (paymentStatus) {
      case 'pending': {
        toast({
          title: 'Pago pendiente',
          description:
            'Cuando el pago sea aprobado te enviaremos un correo con tu producto',
          duration: 10000,
          className: 'bg-yellow-500 border-yellow-500',
        });
        break;
      }
      case 'failure': {
        toast({
          title: 'Pago fallido',
          description:
            'El pago no fue aprobado, te recomendamos volver a intentarlo',
          duration: 10000,
          variant: 'destructive',
        });
        break;
      }
    }
  }, [paymentStatus, toast]);

  return (
    <>
      <section className="py-12 bg-gray-100 dark:bg-gray-800 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div className="grid gap-4">
              <Image
                src={product.image_url}
                alt="Product Image"
                width={600}
                height={600}
                className="object-cover w-full rounded-lg"
                style={{ aspectRatio: '600/600', objectFit: 'cover' }}
              />
              <div className="grid grid-cols-3 gap-4">
                <Image
                  src={product.image_url}
                  alt="Product Thumbnail"
                  width={100}
                  height={100}
                  className="object-cover w-full rounded-lg"
                  style={{ aspectRatio: '100/100', objectFit: 'cover' }}
                />
                <Image
                  src={product.image_url}
                  alt="Product Thumbnail"
                  width={100}
                  height={100}
                  className="object-cover w-full rounded-lg"
                  style={{ aspectRatio: '100/100', objectFit: 'cover' }}
                />
                <Image
                  src={product.image_url}
                  alt="Product Thumbnail"
                  width={100}
                  height={100}
                  className="object-cover w-full rounded-lg"
                  style={{ aspectRatio: '100/100', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  {product.name}
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  {product.description}
                </p>
              </div>
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
                          <SelectItem
                            key={quantity}
                            value={quantity.toString()}
                          >
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
      <Toaster />
    </>
  );
}

export default ProductDetails;
