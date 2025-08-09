'use client';
import React, { useState } from 'react';
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
import { Input } from '@soybelumont/ui/components/input';
import { Button } from '@soybelumont/ui/components/button';
import axios from 'axios';

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
    </div>
    <div className="text-right">
      <div className="font-medium">{formatPrice(product.price)}</div>
    </div>
  </div>
);

interface OrderSummaryProps {
  product: Product;
  finalPrice: number | null;
  discountAmount: number | null;
  setFinalPrice: (price: number) => void;
  setDiscountAmount: (amount: number) => void;
  setPromoCode: (code: string) => void;
}

export default function OrderSummary({
  product,
  finalPrice,
  discountAmount,
  setFinalPrice,
  setDiscountAmount,
  setPromoCode,
}: OrderSummaryProps) {
  const t = useTranslations('ORDER_SUMMARY');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApplyPromoCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('/api/promos/validate', {
        code: promoCodeInput,
        product_id: product.id,
      });
      if (response.data.valid) {
        setFinalPrice(response.data.final_price);
        setDiscountAmount(response.data.discount_amount);
        setPromoCode(promoCodeInput);
        setSuccess(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Ocurrió un error al validar el código.'
      );
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleApplyPromoCode} className="w-full mt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Código de promoción"
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value)}
            />
            <Button type="submit" disabled={loading} loading={loading}>
              Aplicar
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </form>
        <Separator className="my-4" />
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(product.price)}</span>
          </div>
          {discountAmount !== null && discountAmount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span>Descuento</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between w-full mt-4">
            <div className="text-lg font-semibold">{t('TOTAL')}</div>
            <div className="text-xl font-semibold">
              {formatPrice(finalPrice ?? product.price)}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
