'use client';

import { Product } from '@core/data/supabase/products';
import ProductSelectedContext from './ProductSelectedContext';
import React from 'react';
import { toggleProductActive } from '@modules/products/actions/toggleProductActive';

interface ProductSelectedProviderProps extends React.PropsWithChildren {
  product: Product;
}

const ProductSelectedProvider = ({
  children,
  product: initialProduct,
}: ProductSelectedProviderProps) => {
  const [product, setProduct] = React.useState(initialProduct);
  const [isTogglingActive, setIsTogglingActive] = React.useState(false);

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

  /**
   * Toggles the active status of the product.
   *
   * @param {boolean} active - The new active status.
   */
  const toggleActive = async (active: boolean) => {
    setIsTogglingActive(true);
    try {
      const updatedProduct = await toggleProductActive(product.id, active);
      setProduct(updatedProduct);
    } finally {
      setIsTogglingActive(false);
    }
  };

  return (
    <ProductSelectedContext.Provider
      value={{ product, updateProduct, toggleActive, isTogglingActive }}
    >
      {children}
    </ProductSelectedContext.Provider>
  );
};

export default ProductSelectedProvider;
