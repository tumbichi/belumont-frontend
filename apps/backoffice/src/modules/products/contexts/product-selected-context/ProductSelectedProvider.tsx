'use client';

import { Product } from '@core/data/supabase/products';
import ProductSelectedContext from './ProductSelectedContext';
import React from 'react';

interface ProductSelectedProviderProps extends React.PropsWithChildren {
  product: Product;
}

const ProductSelectedProvider = ({
  children,
  product: initialProduct,
}: ProductSelectedProviderProps) => {
  const [product, setProduct] = React.useState(initialProduct);

  /**
   * Updates the product state with the provided partial product object.
   *
   * @param {Partial<Product>} updatedProduct - The partial product object to be merged with the existing product state.
   */
  const updateProduct = (updatedProduct: Partial<Product>) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      ...updatedProduct,
    }));
  };

  return (
    <ProductSelectedContext.Provider value={{ product, updateProduct }}>
      {children}
    </ProductSelectedContext.Provider>
  );
};

export default ProductSelectedProvider;
