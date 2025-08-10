import { z } from 'zod';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { MercadoPagoRepository } from '@core/data/mercadopago/mercadopago.repository';
import { AxiosError } from 'axios';
import { validatePromoCode } from '@core/data/supabase/promos/services/validatePromoCode';

const supabaseRepository = SupabaseRepository();

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  product_id: z.string(),
  promo_code: z.string().optional(),
});

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
    let promoCode = null;

    if (body.promo_code) {
      promoCode = await supabaseRepository.promos.getByCode(body.promo_code);

      console.log('promoCode', promoCode);

      if (!promoCode) {
        return Response.json(
          { message: 'El código promocional no existe' },
          { status: 404 }
        );
      }

      const validation = validatePromoCode(promoCode, body.product_id);

      if (!validation.valid) {
        return Response.json({ message: validation.message }, { status: 400 });
      }

      if (promoCode.discount_type === 'PERCENTAGE') {
        finalPrice =
          product.price - (product.price * promoCode.discount_value) / 100;
      } else if (promoCode.discount_type === 'FIXED') {
        finalPrice = product.price - promoCode.discount_value;
      }
      if (finalPrice < 0) {
        finalPrice = 0;
      }
    }

    console.log('finalPrice', finalPrice);

    const order = await supabaseRepository.orders.create(
      body.product_id,
      user.id
    );

    if (finalPrice === 0) {
      await supabaseRepository.orders.updateStatus(order.id, 'completed');
      await supabaseRepository.payments.create(order.id, 'N/A', 'free');

      console.log('Order completed with no payment required');

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
