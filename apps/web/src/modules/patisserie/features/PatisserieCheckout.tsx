'use client';

import { useState, useEffect, useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { CartDrawer } from '../components/CartDrawer';

export function PatisserieCheckout() {
  const { itemCount, lastAddedAt, lastAddWasFirst } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const prevLastAddedAt = useRef(0);

  useEffect(() => {
    if (lastAddedAt === 0 || lastAddedAt === prevLastAddedAt.current) return;
    prevLastAddedAt.current = lastAddedAt;

    if (lastAddWasFirst) {
      setDrawerOpen(true);
    } else {
      setPulsing(true);
      const timer = setTimeout(() => setPulsing(false), 400);
      return () => clearTimeout(timer);
    }
  }, [lastAddedAt, lastAddWasFirst]);

  return (
    <>
      <style>{`
        @keyframes cart-pulse {
          0%   { transform: translateX(-50%) scale(1); }
          30%  { transform: translateX(-50%) scale(1.12); }
          60%  { transform: translateX(-50%) scale(0.95); }
          100% { transform: translateX(-50%) scale(1); }
        }
        @keyframes cart-pulse-desktop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.12); }
          60%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .cart-pulse-mobile { animation: cart-pulse 0.4s ease-out; }
        .cart-pulse-desktop { animation: cart-pulse-desktop 0.4s ease-out; }
      `}</style>

      {/* Floating cart button — pill shaped */}
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="Ver carrito"
        className={[
          'fixed bottom-6 left-1/2 -translate-x-1/2',
          'sm:left-auto sm:translate-x-0 sm:right-6',
          'z-50 h-14 px-6 rounded-full',
          'bg-amber-500 hover:bg-amber-600 text-white',
          'shadow-lg hover:shadow-xl',
          'flex items-center gap-2 transition-colors duration-200 cursor-pointer',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
          pulsing ? 'cart-pulse-mobile sm:cart-pulse-desktop' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <ShoppingBag className="w-5 h-5 flex-shrink-0" />
        <span className="font-semibold text-sm whitespace-nowrap">
          {itemCount > 0 ? `Mi pedido · ${itemCount}` : 'Mi pedido'}
        </span>
      </button>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
