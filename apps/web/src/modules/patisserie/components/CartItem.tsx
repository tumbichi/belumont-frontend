'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@soybelumont/ui/components/button';
import { CartItem as CartItemType } from '../types/patisserie.types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-3 py-3 border-b border-stone-100 last:border-0">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-stone-100">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt={item.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
            🧁
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-900 truncate">
          {item.name}
        </p>
        <p className="text-sm text-amber-700 font-semibold">
          ${(item.price * item.quantity).toLocaleString('es-AR')}
        </p>
        <p className="text-xs text-stone-400">
          ${item.price.toLocaleString('es-AR')} c/u
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="w-6 h-6"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-sm font-medium w-5 text-center">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="w-6 h-6"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 ml-auto text-red-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
