import React from 'react';
import { ProductsRepository } from '@core/data/supabase/products';
import CheckoutLayout from '../../modules/payments/layout/CheckoutLayout';
import Checkout from '../../modules/payments/components/Checkout';

interface CheckoutPageProps {
  searchParams: Promise<{
    productId?: string;
    paymentStatus?: 'pending' | 'failure' | null;
    email?: string;
    name?: string;
  }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { productId, paymentStatus, email, name } = await searchParams;

  if (!productId) {
    // Handle case where productId is not provided
    return <div>Product not found</div>;
  }

  const product = await ProductsRepository().getById(productId);

  if (!product) {
    // Handle case where product is not found
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <CheckoutLayout paymentStatus={paymentStatus}>
        <Checkout product={product} email={email} name={name} />
      </CheckoutLayout>
    </div>
  );
}
