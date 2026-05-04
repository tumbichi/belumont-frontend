'use client';

import React from 'react';
import { PatisserieProduct } from '@modules/patisserie/types/patisserie.types';
import PatisserieSelectedContext from './PatisserieSelectedContext';
import { togglePatisserieProductActive } from '@modules/patisserie/actions/togglePatisserieProductActive';

interface PatisserieSelectedProviderProps extends React.PropsWithChildren {
  product: PatisserieProduct;
}

const PatisserieSelectedProvider = ({
  children,
  product: initialProduct,
}: PatisserieSelectedProviderProps) => {
  const [product, setProduct] = React.useState(initialProduct);
  const [isTogglingActive, setIsTogglingActive] = React.useState(false);

  const updateProduct = (updatedProduct: Partial<PatisserieProduct>) => {
    setProduct((prev) => ({ ...prev, ...updatedProduct }));
  };

  const toggleActive = async (active: boolean) => {
    setIsTogglingActive(true);
    try {
      const updated = await togglePatisserieProductActive(product.id, active);
      setProduct(updated);
    } catch (error) {
      setIsTogglingActive(false);
      throw error;
    }
    setIsTogglingActive(false);
  };

  return (
    <PatisserieSelectedContext.Provider
      value={{ product, updateProduct, toggleActive, isTogglingActive }}
    >
      {children}
    </PatisserieSelectedContext.Provider>
  );
};

export default PatisserieSelectedProvider;
