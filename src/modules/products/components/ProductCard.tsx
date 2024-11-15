import React from "react";
import { Button } from "@core/components/ui/button";
import Image from "next/image";
import { Product } from "../data/products.repository";
import { format } from "path";
import { formatPrice } from "@core/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <Image
        src={product.image_url}
        alt="Product Image"
        width={400}
        height={300}
        className="w-full h-48 object-cover"
        style={{ aspectRatio: "400/300", objectFit: "cover" }}
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500 dark:text-gray-400">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
          <Link key={product.id} href={`/products/${product.id}`} className="block mb-2">
            <Button size="sm">Comprar</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;