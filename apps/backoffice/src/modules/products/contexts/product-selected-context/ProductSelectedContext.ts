'use client';

import { Product } from '@core/data/supabase/products';
import React from 'react';

export interface ProductSelectedContextValue {
  product: Product;
  updateProduct: (updatedProduct: Partial<Product>) => void;
  toggleActive: (active: boolean) => Promise<void>;
  isTogglingActive: boolean;
}

const ProductSelectedContext = React.createContext<
  ProductSelectedContextValue | undefined
>(undefined);

export default ProductSelectedContext;
