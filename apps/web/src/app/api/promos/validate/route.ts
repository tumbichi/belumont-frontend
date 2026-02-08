import { z } from 'zod';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { PromoCode } from '@core/data/supabase/promos/promos.repository';
import { captureCriticalError } from '@core/lib/sentry';

const supabaseRepository = SupabaseRepository();

const bodySchema = z.object({
  code: z.string(),
  product_id: z.string(),
});

// TODO: deduplicate validatePromoCode — same logic exists as imported service in /api/orders/route.ts
const validatePromoCode = (
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

export async function POST(request: Request) {
  const reqBody = await request.json();

  try {
    const body = bodySchema.parse(reqBody);

    const promoCode = await supabaseRepository.promos.getByCode(body.code);

    if (!promoCode) {
      return Response.json(
        { valid: false, message: 'Código promocional no encontrado.' },
        { status: 404 }
      );
    }

    const validation = validatePromoCode(promoCode, body.product_id);

    if (!validation.valid) {
      return Response.json(validation, { status: 400 });
    }

    const product = await supabaseRepository.products.getById(body.product_id);

    if (!product) {
      return Response.json(
        { valid: false, message: 'Producto no encontrado.' },
        { status: 404 }
      );
    }

    let finalPrice = product.price;
    let discountAmount = 0;

    if (promoCode.discount_type === 'PERCENTAGE') {
      discountAmount = (product.price * promoCode.discount_value) / 100;
      finalPrice = product.price - discountAmount;
    } else if (promoCode.discount_type === 'FIXED') {
      discountAmount = promoCode.discount_value;
      finalPrice = product.price - discountAmount;
    }

    if (finalPrice < 0) {
      finalPrice = 0;
    }

    return Response.json({
      valid: true,
      final_price: finalPrice,
      discount_amount: discountAmount,
      message: validation.message,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { valid: false, message: 'Invalid request body', errors: error.errors },
        { status: 400 }
      );
    }
    captureCriticalError(error, 'promo-validation', {
      code: reqBody?.code,
      productId: reqBody?.product_id,
    });

    return Response.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
