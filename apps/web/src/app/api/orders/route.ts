import { z } from 'zod';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
// TODO: deduplicate validatePromoCode — same logic exists inline in /api/promos/validate/route.ts
import { validatePromoCode } from '@core/data/supabase/promos/services/validatePromoCode';
import { MercadoPagoRepository } from '@core/data/mercadopago/mercadopago.repository';
import { Order } from '@core/data/supabase/orders/orders.repository';
import { captureCriticalError } from '@core/lib/sentry';

interface PostOrdersMercadoPagoReturn {
  paymentUrl: string;
  order: Order;
}

interface PostOrdersFreeReturn {
  order: Order;
}

export type PostOrdersSuccessReturn =
  | PostOrdersMercadoPagoReturn
  | PostOrdersFreeReturn;

const supabaseRepository = SupabaseRepository();

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  product_id: z.string(),
  promo_code_id: z.string().optional(),
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

    if (body.promo_code_id) {
      promoCode = await supabaseRepository.promos.getByCode(body.promo_code_id);

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

    const payment =
      finalPrice === 0 && promoCode
        ? await supabaseRepository.payments.create('N/A', 'free', promoCode.id)
        : await supabaseRepository.payments.create(
            'N/A',
            'mercadopago',
            promoCode?.id
          );

    let order = await supabaseRepository.orders.create(
      body.product_id,
      user.id,
      payment.id
    );

    console.log('order created:', order);

    if (finalPrice === 0 && promoCode) {
      console.log('Final price is 0, completing order without payment gateway');
      order = await supabaseRepository.orders.updateStatus(
        order.id,
        'completed'
      );
      await supabaseRepository.promos.incrementUsage(promoCode.id);
      await supabaseRepository.payments.update(payment.id, {
        status: 'approved',
      });
      return Response.json({ order });
    } else {
      const paymentUrl = await MercadoPagoRepository().generatePaymentUrl(
        product,
        user,
        { orderId: order.id }
      );
      return Response.json({ paymentUrl, order });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { message: 'Invalid request', errors: error.errors },
        { status: 400 }
      );
    }
    captureCriticalError(error, 'order-creation', {
      productId: reqBody?.product_id,
      email: reqBody?.email,
      hasPromoCode: !!reqBody?.promo_code_id,
    });

    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
