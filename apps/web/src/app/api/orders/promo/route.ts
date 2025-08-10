import { z } from 'zod';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { validatePromoCode } from '@core/data/supabase/promos/services/validatePromoCode';

const supabaseRepository = SupabaseRepository();

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  product_id: z.string(),
  promo_code: z.string(),
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

    const promoCode = await supabaseRepository.promos.getByCode(
      body.promo_code
    );
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

    let finalPrice = product.price;
    if (promoCode.discount_type === 'PERCENTAGE') {
      finalPrice =
        product.price - (product.price * promoCode.discount_value) / 100;
    } else if (promoCode.discount_type === 'FIXED') {
      finalPrice = product.price - promoCode.discount_value;
    }
    if (finalPrice < 0) {
      finalPrice = 0;
    }

    if (finalPrice === 0) {
      const order = await supabaseRepository.orders.create(
        body.product_id,
        user.id
      );
      await supabaseRepository.orders.updateStatus(order.id, 'completed');
      const payment = await supabaseRepository.payments.create(
        order.id,
        'N/A',
        'free'
      );
      await supabaseRepository.payments.updateStatus(payment.id, 'approved');

      await supabaseRepository.promos.incrementUsage(promoCode.id);

      return Response.json({ order_id: order.id, status: 'completed' });
    } else {
      return Response.json(
        { message: 'El codigo no es de 100% de descuento' },
        { status: 400 }
      );
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
