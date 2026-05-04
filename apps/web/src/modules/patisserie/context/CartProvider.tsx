'use client';

import {
  createContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { CartContext, CartState } from './CartContext';
import { PatisserieProduct, CartItem } from '../types/patisserie.types';
import { cartStorage } from '../utils/cartStorage';

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const [lastAddWasFirst, setLastAddWasFirst] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = cartStorage.get();
    setItems(stored);
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (isHydrated) {
      cartStorage.set(items);
    }
  }, [items, isHydrated]);

  const addItem = useCallback(
    (product: PatisserieProduct, quantity: number = 1) => {
      setItems((prev) => {
        const wasEmpty = prev.length === 0;
        setLastAddWasFirst(wasEmpty);
        setLastAddedAt(Date.now());

        const existingItem = prev.find((item) => item.id === product.id);

        if (existingItem) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            pathname: product.pathname,
            thumbnail_url: product.thumbnail_url,
            metadata: product.metadata,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    cartStorage.clear();
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const cartState: CartState = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    lastAddedAt,
    lastAddWasFirst,
  };

  return (
    <CartContext.Provider value={cartState}>{children}</CartContext.Provider>
  );
}
