'use client';

import { PatisserieProduct } from '../types/patisserie.types';
import { PatisserieCard } from './PatisserieCard';

interface PatisserieGridProps {
  products: PatisserieProduct[];
  onAddToCart: (product: PatisserieProduct) => void;
}

export function PatisserieGrid({ products, onAddToCart }: PatisserieGridProps) {
  // Group products by category
  const grouped = products.reduce<Record<string, PatisserieProduct[]>>(
    (acc, product) => {
      const key = product.category ?? 'Otros';
      if (!acc[key]) acc[key] = [];
      acc[key].push(product);
      return acc;
    },
    {}
  );

  const categories = Object.keys(grouped).sort();

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-stone-500 text-lg">
          No hay productos disponibles por el momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <section key={category}>
          <h2 className="text-2xl font-display font-semibold text-stone-800 mb-6 pb-2 border-b border-stone-200">
            {category}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(grouped[category] ?? []).map((product) => (
              <PatisserieCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
