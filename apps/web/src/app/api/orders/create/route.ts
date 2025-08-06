import { z } from 'zod';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { MercadoPagoRepository } from '@core/data/mercadopago/mercadopago.repository';
import { AxiosError } from 'axios';
import { PromoCode } from '@core/data/supabase/promos/promos.repository';

const supabaseRepository = SupabaseRepository();

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  product_id: z.string(),
  promo_code: z.string().optional(),
});

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

    const product = await supabaseRepository.products.getById(body.product_id);

    if (!product) {
      return Response.json(
        { message: 'El producto no existe' },
        { status: 404 }
      );
    }

    let user = await supabaseRepository.users.getByEmail(body.email);

    if (!user) {
      user = await supabaseRepository.users.create(body.email, body.name);
    }

    let finalPrice = product.price;
    let promoCode: PromoCode | null = null;

    if (body.promo_code) {
      promoCode = await supabaseRepository.promos.getByCode(body.promo_code);
      if (promoCode) {
        const validation = validatePromoCode(promoCode, body.product_id);
        if (validation.valid) {
          if (promoCode.discount_type === 'PERCENTAGE') {
            finalPrice =
              product.price -
              (product.price * promoCode.discount_value) / 100;
          } else if (promoCode.discount_type === 'FIXED') {
            finalPrice = product.price - promoCode.discount_value;
          }
          if (finalPrice < 0) {
            finalPrice = 0;
          }
        }
      }
    }

    const order = await supabaseRepository.orders.create(
      body.product_id,
      user.id
    );

    if (finalPrice === 0) {
      await supabaseRepository.orders.updateStatus(order.id, 'completed');
      await supabaseRepository.payments.create({
        order_id: order.id,
        provider: 'free',
        status: 'approved',
        provider_id: 'N/A',
      });

      if (promoCode) {
        await supabaseRepository.promos.incrementUsage(promoCode.id);
      }

      return Response.json({ order_id: order.id, status: 'completed' });
    } else {
      try {
        const paymentUrl = await MercadoPagoRepository().generatePaymentUrl(
          { ...product, price: finalPrice },
          user,
          { orderId: order.id }
        );
        if (promoCode) {
          await supabaseRepository.promos.incrementUsage(promoCode.id);
        }
        return Response.json({ order_id: order.id, payment_link: paymentUrl });
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log('error.message', error?.message);
          console.log('response.data', error.response?.data);
          console.log('response.status', error.response?.status);

          return Response.json(
            {
              error: error.response,
              message: error.message,
              cause: error.cause,
            },
            { status: 500 }
          );
        }

        throw error;
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { message: 'Invalid request body', errors: error.errors },
        { status: 400 }
      );
    }
    console.error(error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
