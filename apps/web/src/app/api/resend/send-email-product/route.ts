import ResendRepository from '@core/data/resend/resend.repository';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import ProductDelivery from '@core/emails/ProductDelivery';
import PackDelivery from '@core/emails/PackDelivery';
import { captureCriticalError } from '@core/lib/sentry';
import {
  logger,
  trace,
  logCriticalError,
  setRequestAttributes,
} from '@core/lib/sentry-logger';
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
  return trace(
    { name: 'POST /api/resend/send-email-product', op: 'http.server' },
    async () => {
      try {
        const body = bodySchema.parse(await request.json());

        setRequestAttributes({
          'delivery.paymentId': body.record.id,
          'delivery.paymentStatus': body.record.status,
          'delivery.provider': body.record.provider,
        });

        if (body.record.status !== 'approved') {
          logger.debug('Delivery skipped: payment not approved', {
            paymentId: body.record.id,
            status: body.record.status,
          });
          return Response.json({ body });
        }

        const supabaseRepository = SupabaseRepository();

        const order = await trace(
          { name: 'updateOrderStatusByPaymentId', op: 'db.query' },
          () =>
            supabaseRepository.orders.updateStatusByPaymentId(
              body.record.id,
              'paid',
            ),
        );

        const [product, user] = await Promise.all([
          trace({ name: 'getProduct', op: 'db.query' }, () =>
            supabaseRepository.products.getById(order.product_id),
          ),
          trace({ name: 'getUser', op: 'db.query' }, () =>
            supabaseRepository.users.getById(order.user_id),
          ),
        ]);

        if (!user) {
          logCriticalError(
            new Error('User not found for approved payment'),
            'product-delivery-email',
            {
              orderId: order.id,
              userId: order.user_id,
              paymentId: body.record.id,
            },
          );

          captureCriticalError(
            new Error('User not found for approved payment'),
            'product-delivery-email',
            {
              orderId: order.id,
              userId: order.user_id,
              paymentId: body.record.id,
              note: 'El usuario pagó pero no existe en la base de datos',
            },
          );

          return Response.json(
            { message: 'User does not exist' },
            { status: 404 },
          );
        }

        if (!product) {
          logCriticalError(
            new Error('Product not found for approved payment'),
            'product-delivery-email',
            {
              orderId: order.id,
              productId: order.product_id,
              paymentId: body.record.id,
            },
          );

          captureCriticalError(
            new Error('Product not found for approved payment'),
            'product-delivery-email',
            {
              orderId: order.id,
              productId: order.product_id,
              paymentId: body.record.id,
              note: 'El usuario pagó pero el producto no existe en la base de datos',
            },
          );

          return Response.json(
            { message: 'Product does not exist' },
            { status: 404 },
          );
        }

        // Determine email template based on product type
        let emailReactComponent: React.ReactElement;

        if (product.product_type === 'bundle') {
          // Get all items in the bundle with download URLs (server-side only)
          const bundleItems = await trace(
            { name: 'getBundleItems', op: 'db.query' },
            () =>
              supabaseRepository.products.getBundleItems(product.id, {
                includeDownloadUrl: true,
              }),
          );

          const downloadItems = bundleItems
            .filter((item) => item.product.download_url) // Only items with download URL
            .map((item) => ({
              name: item.product.name,
              downloadUrl: item.product.download_url!,
            }));

          if (downloadItems.length === 0) {
            throw new Error('Bundle has no downloadable items');
          }

          emailReactComponent = PackDelivery({
            packName: product.name,
            username: user.name,
            items: downloadItems,
          });
        } else {
          // Single product - use original template
          if (!product.download_url) {
            logCriticalError(
              new Error('Product does not have a download URL'),
              'product-delivery-email',
              {
                orderId: order.id,
                productId: product.id,
                productName: product.name,
                paymentId: body.record.id,
              },
            );

            captureCriticalError(
              new Error('Product does not have a download URL'),
              'product-delivery-email',
              {
                orderId: order.id,
                productId: product.id,
                productName: product.name,
                paymentId: body.record.id,
                note: 'El usuario pagó pero el producto no tiene URL de descarga configurada',
              },
            );

            return Response.json(
              { message: 'Product does not have a download URL' },
              { status: 422 },
            );
          }

          emailReactComponent = ProductDelivery({
            productName: product.name,
            username: user.name,
            downloadLink: product.download_url,
          });
        }

        // Send email
        try {
          await trace(
            { name: 'sendDeliveryEmail', op: 'http.client' },
            () =>
              ResendRepository().sendEmail({
                to: user.email,
                from: String(process.env.RESEND_FROM_EMAIL),
                subject: `${product.name} | @soybelumont`,
                react: emailReactComponent,
              }),
          );

          await trace(
            { name: 'markOrderCompleted', op: 'db.query' },
            () => supabaseRepository.orders.updateStatus(order.id, 'completed'),
          );

          logger.info('Product delivered successfully', {
            orderId: order.id,
            productId: product.id,
            productName: product.name,
            productType: product.product_type ?? 'single',
            userEmail: user.email,
            paymentId: body.record.id,
            provider: body.record.provider,
          });
        } catch (emailError) {
          logCriticalError(emailError, 'product-delivery-email', {
            orderId: order.id,
            productId: product.id,
            productName: product.name,
            paymentId: body.record.id,
          });

          captureCriticalError(emailError, 'product-delivery-email', {
            orderId: order.id,
            productId: product.id,
            productName: product.name,
            userEmail: user.email,
            paymentId: body.record.id,
            note: 'URGENTE: El usuario pagó pero el email de entrega falló',
          });

          return Response.json(
            { message: 'Failed to send product delivery email' },
            { status: 500 },
          );
        }

        return Response.json({ body });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return Response.json(
            { message: 'Invalid webhook payload', errors: error.errors },
            { status: 400 },
          );
        }

        logCriticalError(error, 'product-delivery-email');

        captureCriticalError(error, 'product-delivery-email', {
          note: 'Error no manejado en la entrega de producto por email',
        });

        return Response.json(
          { message: 'Internal server error' },
          { status: 500 },
        );
      }
    },
  );
}
