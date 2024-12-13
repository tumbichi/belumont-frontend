import ResendRepository from '@core/data/resend/resend.repository';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import ProductDelivery from '@core/emails/ProductDelivery';
import { isAxiosError } from 'axios';
import { z } from 'zod';

const recordSchema = z.object({
  id: z.string(),
  status: z.enum([
    'approved',
    'pending',
    'authorized',
    'in_process',
    'in_mediation',
    'rejected',
    'cancelled',
    'refunded',
    'charged_back',
  ]),
  order_id: z.string(),
  provider: z.literal('mercadopago'),
  created_at: z.string(),
  updated_at: z.string(),
  provider_id: z.string(),
});

const bodySchema = z
  .object({
    record: recordSchema,
  })
  .passthrough();

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());

  if (body.record.status === 'approved') {
    const supabaseRepository = SupabaseRepository();

    const order = await supabaseRepository.orders.updateStatus(
      body.record.order_id,
      'paid'
    );
    const product = await supabaseRepository.products.getById(order.product_id);
    const user = await supabaseRepository.users.getById(order.user_id);

    if (!user) {
      throw new Error('User does not exist');
    }

    if (!product) {
      throw new Error('Product does not exist');
    }

    // Send email
    ResendRepository()
      .sendEmail({
        to: user.email,
        from: String(process.env.RESEND_FROM_EMAIL),
        subject: `${product.name} | @soybelumont`,
        react: ProductDelivery({
          productName: product.name,
          username: user.name,
          downloadLink: product.download_url,
        }),
      })
      .then((data) => {
        console.log('email response:', data);
        supabaseRepository.orders.updateStatus(order.id, 'completed');
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          console.log('error', error.response);
        } else {
          console.log('error', error);
        }
      });
  }

  return Response.json({ body });
}
