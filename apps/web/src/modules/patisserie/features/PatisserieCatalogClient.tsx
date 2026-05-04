'use client';

import { PatisserieProduct } from '../types/patisserie.types';
import { PatisserieGrid } from '../components/PatisserieGrid';
import { useCart } from '../hooks/useCart';

interface PatisserieCatalogClientProps {
  products: PatisserieProduct[];
}

export function PatisserieCatalogClient({
  products,
}: PatisserieCatalogClientProps) {
  const { addItem } = useCart();

  return <PatisserieGrid products={products} onAddToCart={addItem} />;
}
