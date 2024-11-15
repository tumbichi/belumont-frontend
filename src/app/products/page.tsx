// "use client";

import Link from "next/link";
import Container from "@core/components/layouts/Container";
import ProductsRepository from "../../modules/products/data/products.repository";
import ProductCard from "../../modules/products/components/ProductCard";

export default async function ProductsPage() {
  const products = await ProductsRepository().getAll();

  return (
    <Container>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
}
