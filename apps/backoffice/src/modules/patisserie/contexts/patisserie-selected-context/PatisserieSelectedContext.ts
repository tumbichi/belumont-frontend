'use client';

import { PatisserieProduct } from '@modules/patisserie/types/patisserie.types';
import React from 'react';

export interface PatisserieSelectedContextValue {
  product: PatisserieProduct;
  updateProduct: (updatedProduct: Partial<PatisserieProduct>) => void;
  toggleActive: (active: boolean) => Promise<void>;
  isTogglingActive: boolean;
}

const PatisserieSelectedContext = React.createContext<
  PatisserieSelectedContextValue | undefined
>(undefined);

export default PatisserieSelectedContext;
