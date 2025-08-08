'use client';
import React, { useEffect, useState } from 'react';
import Payment from '../../modules/payments/components/Payment';
import OrderSummary from '../../modules/payments/components/OrderSummary';
import { ProductsRepository } from '@core/data/supabase/products';
import CheckoutLayout from '../../modules/payments/layout/CheckoutLayout';
import { useSearchParams } from 'next/navigation';
import { Product } from '@core/data/supabase/products/products.repository';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const paymentStatus = searchParams.get('paymentStatus') as
    | 'pending'
    | 'failure'
    | null;
  const email = searchParams.get('email');
  const name = searchParams.get('name');

  const [product, setProduct] = useState<
    (Product & { download_url: string }) | null
  >(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (productId) {
      ProductsRepository()
        .getById(productId)
        .then((p) => {
          setProduct(p);
          if (p) {
            setFinalPrice(p.price);
          }
        });
    }
  }, [productId]);

  return (
    <div className="max-w-6xl mx-auto">
      <CheckoutLayout paymentStatus={paymentStatus}>
        {product && (
          <Payment
            defaultValues={email || name ? { email, name } : undefined}
            product={product}
            finalPrice={finalPrice}
            promoCode={promoCode}
          />
        )}
        {product && (
          <OrderSummary
            product={product}
            finalPrice={finalPrice}
            discountAmount={discountAmount}
            setFinalPrice={setFinalPrice}
            setDiscountAmount={setDiscountAmount}
            setPromoCode={setPromoCode}
          />
        )}
      </CheckoutLayout>
    </div>
  );
}
