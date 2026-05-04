import { CartItem } from '../types/patisserie.types';

const CART_KEY = 'bm_patisserie_cart';

export const cartStorage = {
  get: (): CartItem[] => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as CartItem[];
    } catch (error) {
      console.error('[cartStorage] Error reading from localStorage:', error);
      return [];
    }
  },

  set: (items: CartItem[]): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('[cartStorage] Error writing to localStorage:', error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(CART_KEY);
    } catch (error) {
      console.error('[cartStorage] Error clearing localStorage:', error);
    }
  },
};
