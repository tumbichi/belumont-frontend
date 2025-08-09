
'use client';
import React, { useState } from 'react';
import Payment from './Payment';
import OrderSummary from './OrderSummary';
import { Product } from '@core/data/supabase/products/products.repository';

interface CheckoutProps {
  product: Product & { download_url: string };
  email?: string;
  name?: string;
}

export default function Checkout({ product, email, name }: CheckoutProps) {
  const [finalPrice, setFinalPrice] = useState<number | null>(product.price);
  const [discountAmount, setDiscountAmount] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState<string | undefined>(undefined);

  return (
    <>
      <Payment
        defaultValues={email || name ? { email, name } : undefined}
        product={product}
        finalPrice={finalPrice}
        promoCode={promoCode}
      />
      <OrderSummary
        product={product}
        finalPrice={finalPrice}
        discountAmount={discountAmount}
        setFinalPrice={setFinalPrice}
        setDiscountAmount={setDiscountAmount}
        setPromoCode={setPromoCode}
      />
    </>
  );
}
