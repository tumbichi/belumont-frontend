'use client';

import { useCart } from './useCart';
import { formatWhatsAppMessage } from '../utils/formatWhatsAppMessage';
import { OrderFormData } from '../types/patisserie.types';

export function useWhatsAppOrder() {
  const { items, total } = useCart();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const openWhatsApp = (form: OrderFormData) => {
    const message = formatWhatsAppMessage(items, form, total);
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return { openWhatsApp };
}
