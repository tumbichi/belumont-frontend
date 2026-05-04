import { createContext } from 'react';
import { CartItem, PatisserieProduct } from '../types/patisserie.types';

export interface CartState {
  items: CartItem[];
  addItem: (product: PatisserieProduct, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  /** Timestamp (Date.now()) updated on each addItem call */
  lastAddedAt: number;
  /** True if the last addItem was the first item added to an empty cart */
  lastAddWasFirst: boolean;
}

export const CartContext = createContext<CartState | null>(null);
