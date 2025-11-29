'use client';

import { Product } from '@core/data/supabase/products';
import React from 'react';

export interface ProductSelectedContextValue {
  product: Product;
  updateProduct: (updatedProduct: Partial<Product>) => void;
}

const ProductSelectedContext = React.createContext<
  ProductSelectedContextValue | undefined
>(undefined);

export default ProductSelectedContext;
