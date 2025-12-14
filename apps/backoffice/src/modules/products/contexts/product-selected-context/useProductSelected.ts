'use client';

import React from 'react';
import ProductSelectedContext from './ProductSelectedContext';

const useProductSelected = () => {
  const context = React.useContext(ProductSelectedContext);
  if (!context) {
    throw new Error(
      'useProductSelected must be used within a ProductSelectedContext.Provider'
    );
  }
  return context;
};

export default useProductSelected;
