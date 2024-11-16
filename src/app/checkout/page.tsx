import React from "react";
import Payment from "../../modules/payments/components/Payment";
import OrderSummary from "../../modules/payments/components/OrderSummary";
import { ProductsRepository } from "@core/data/supabase/products";

interface CheckoutPageProps {
  searchParams: Promise<{ productId: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const productId = (await searchParams).productId;
  const product = await ProductsRepository().getById(productId);
  return (
    <div className="grid max-w-6xl gap-6 px-4 py-8 mx-auto md:grid-cols-2">
      <Payment />
      {product && <OrderSummary product={product} />}
    </div>
  );
}
