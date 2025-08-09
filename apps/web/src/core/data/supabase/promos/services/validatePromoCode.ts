
import { PromoCode } from '../promos.repository';

export const validatePromoCode = (
  promoCode: PromoCode,
  productId: string
): { valid: boolean; message: string } => {
  if (!promoCode.is_active) {
    return { valid: false, message: 'El código promocional no está activo.' };
  }

  if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
    return { valid: false, message: 'El código promocional ha expirado.' };
  }

  if (promoCode.max_uses && promoCode.used_count >= promoCode.max_uses) {
    return {
      valid: false,
      message: 'El código promocional ha alcanzado el límite de usos.',
    };
  }

  if (
    !promoCode.applies_to_all &&
    !promoCode.products.some((p) => p.product_id === productId)
  ) {
    return {
      valid: false,
      message: 'El código promocional no es válido para este producto.',
    };
  }

  return { valid: true, message: 'Código aplicado con éxito' };
};
