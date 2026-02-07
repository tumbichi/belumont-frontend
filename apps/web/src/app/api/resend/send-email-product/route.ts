import ResendRepository from '@core/data/resend/resend.repository';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import ProductDelivery from '@core/emails/ProductDelivery';
import PackDelivery from '@core/emails/PackDelivery';
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
  provider: z.union([z.literal('mercadopago'), z.literal('free')]),
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

    const order = await supabaseRepository.orders.updateStatusByPaymentId(
      body.record.id,
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

    // Determine email template based on product type
    let emailReactComponent: React.ReactElement;

    if (product.product_type === 'bundle') {
      // Get all items in the bundle with download URLs (server-side only)
      const bundleItems = await supabaseRepository.products.getBundleItems(
        product.id,
        { includeDownloadUrl: true }
      );

      const downloadItems = bundleItems
        .filter((item) => item.product.download_url) // Only items with download URL
        .map((item) => ({
          name: item.product.name,
          downloadUrl: item.product.download_url!,
        }));

      emailReactComponent = PackDelivery({
        packName: product.name,
        username: user.name,
        items: downloadItems,
      });
    } else {
      // Single product - use original template
      if (!product.download_url) {
        throw new Error('Product does not have a download URL');
      }

      emailReactComponent = ProductDelivery({
        productName: product.name,
        username: user.name,
        downloadLink: product.download_url,
      });
    }

    // Send email
    await ResendRepository()
      .sendEmail({
        to: user.email,
        from: String(process.env.RESEND_FROM_EMAIL),
        subject: `${product.name} | @soybelumont`,
        react: emailReactComponent,
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
