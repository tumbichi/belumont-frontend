import React from "react";
import Payment from "../../modules/checkout/components/Payment";
import OrderSummary from "../../modules/checkout/components/OrderSummary";
import getProductById from "../../modules/products/data/services/getProductById";

export default async function CheckoutPage({ searchParams }: { searchParams: { productId: string } }) {
  const product = await getProductById(searchParams.productId);
  return (
    <div className="grid max-w-6xl gap-6 px-4 py-8 mx-auto md:grid-cols-2">
      <Payment />
      {product && <OrderSummary product={product} />}
    </div>
  );
}
