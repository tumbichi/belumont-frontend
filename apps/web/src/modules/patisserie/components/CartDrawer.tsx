'use client';

import { useState } from 'react';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@soybelumont/ui/components/sheet';
import { Button } from '@soybelumont/ui/components/button';
import { useCart } from '../hooks/useCart';
import { CartItem } from './CartItem';
import { OrderForm } from './OrderForm';
import { OrderFormData } from '../types/patisserie.types';
import { useWhatsAppOrder } from '../hooks/useWhatsAppOrder';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { openWhatsApp } = useWhatsAppOrder();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (form: OrderFormData) => {
    setSubmitting(true);
    openWhatsApp(form);
    setSubmitting(false);
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-stone-100">
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            Tu pedido
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-6">
            <span className="text-5xl">🧁</span>
            <p className="text-stone-500 font-medium">Tu carrito está vacío</p>
            <p className="text-stone-400 text-sm">
              Explorá el catálogo y agregá tus favoritos
            </p>
            <Button variant="outline" onClick={onClose} className="mt-2">
              Ver catálogo
            </Button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Single scroll area */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Items list */}
              <div className="px-5 py-2">
                <div className="divide-y divide-stone-100">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </div>

              {/* Subtotal */}
              <div className="px-5 py-3 border-t border-stone-100 bg-stone-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-stone-600">
                    Subtotal estimado
                  </span>
                  <span className="text-lg font-bold text-stone-900">
                    ${total.toLocaleString('es-AR')}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  El precio final se confirma con Belu.
                </p>
              </div>

              {/* Order form (without submit button) */}
              <div className="px-5 pt-3 pb-2">
                <OrderForm
                  items={items}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  hideSubmitButton
                />
              </div>
            </div>

            {/* Fixed bottom submit button */}
            <div className="px-5 pb-5 pt-3 border-t border-stone-100 shrink-0">
              <Button
                form="order-form"
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Hacer pedido por WhatsApp
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
