import React from 'react';
import Payment from '../../modules/payments/components/Payment';
import OrderSummary from '../../modules/payments/components/OrderSummary';
import { ProductsRepository } from '@core/data/supabase/products';
import CheckoutLayout from '../../modules/payments/layout/CheckoutLayout';

interface CheckoutPageProps {
  searchParams: Promise<{
    productId: string;
    email?: string;
    name?: string;
    paymentStatus?: 'pending' | 'failure';
  }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { productId, paymentStatus, email, name } = await searchParams;
  const product = await ProductsRepository().getById(productId);

  return (
    <div className="max-w-6xl mx-auto">
      <CheckoutLayout paymentStatus={paymentStatus}>
        {product && (
          <Payment
            defaultValues={email || name ? { email, name } : undefined}
            product={product}
          />
        )}
        {product && <OrderSummary product={product} />}
      </CheckoutLayout>
    </div>
  );
}
