import { z } from 'zod';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { PromoCode } from '@core/data/supabase/promos/promos.repository';
import { captureCriticalError } from '@core/lib/sentry';
import { logger, trace, logCriticalError } from '@core/lib/sentry-logger';

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

  return trace(
    { name: 'POST /api/promos/validate', op: 'http.server' },
    async () => {
      try {
        const body = bodySchema.parse(reqBody);

        const promoCode = await trace(
          { name: 'getPromoByCode', op: 'db.query' },
          () => supabaseRepository.promos.getByCode(body.code),
        );

        if (!promoCode) {
          logger.info('Promo validation: code not found', {
            code: body.code,
            productId: body.product_id,
          });
          return Response.json(
            { valid: false, message: 'Código promocional no encontrado.' },
            { status: 404 }
          );
        }

        const validation = validatePromoCode(promoCode, body.product_id);

        if (!validation.valid) {
          logger.info('Promo validation failed', {
            code: body.code,
            productId: body.product_id,
            reason: validation.message,
          });
          return Response.json(validation, { status: 400 });
        }

        const product = await trace(
          { name: 'getProduct', op: 'db.query' },
          () => supabaseRepository.products.getById(body.product_id),
        );

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

        logger.info('Promo validated successfully', {
          code: body.code,
          productId: body.product_id,
          discountType: promoCode.discount_type,
          discountValue: promoCode.discount_value,
          originalPrice: product.price,
          finalPrice,
          discountAmount,
        });

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

        logCriticalError(error, 'promo-validation', {
          code: reqBody?.code ?? 'unknown',
          productId: reqBody?.product_id ?? 'unknown',
        });

        captureCriticalError(error, 'promo-validation', {
          code: reqBody?.code,
          productId: reqBody?.product_id,
        });

        return Response.json(
          { valid: false, message: 'Internal server error' },
          { status: 500 }
        );
      }
    },
  );
}
