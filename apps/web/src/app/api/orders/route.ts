import { z } from 'zod';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
// TODO: deduplicate validatePromoCode — same logic exists inline in /api/promos/validate/route.ts
import { validatePromoCode } from '@core/data/supabase/promos/services/validatePromoCode';
import { MercadoPagoRepository } from '@core/data/mercadopago/mercadopago.repository';
import { Order } from '@core/data/supabase/orders/orders.repository';
import {
  logger,
  trace,
  logCriticalError,
  setRequestAttributes,
} from '@core/lib/sentry-logger';

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

  return trace(
    { name: 'POST /api/orders', op: 'http.server' },
    async () => {
      try {
        const body = bodySchema.parse(reqBody);

        setRequestAttributes({
          'order.email': body.email,
          'order.productId': body.product_id,
          'order.hasPromoCode': !!body.promo_code_id,
        });

        logger.info('Order creation started', {
          email: body.email,
          productId: body.product_id,
          hasPromoCode: !!body.promo_code_id,
        });

        const product = await trace(
          { name: 'getProduct', op: 'db.query' },
          () => supabaseRepository.products.getById(body.product_id),
        );

        if (!product) {
          logger.warn('Order creation failed: product not found', {
            productId: body.product_id,
          });
          return Response.json(
            { message: 'El producto no existe' },
            { status: 404 },
          );
        }

        let user = await trace(
          { name: 'getUserByEmail', op: 'db.query' },
          () => supabaseRepository.users.getByEmail(body.email),
        );

        if (!user) {
          user = await trace(
            { name: 'createUser', op: 'db.query' },
            () => supabaseRepository.users.create(body.email, body.name),
          );
        }

        let finalPrice = product.price;
        let promoCode = null;

        if (body.promo_code_id) {
          promoCode = await trace(
            { name: 'getPromoCode', op: 'db.query' },
            () =>
              supabaseRepository.promos.getByCode(body.promo_code_id as string),
          );

          if (!promoCode) {
            return Response.json(
              { message: 'El código promocional no existe' },
              { status: 404 },
            );
          }

          const validation = validatePromoCode(promoCode, body.product_id);

          if (!validation.valid) {
            return Response.json(
              { message: validation.message },
              { status: 400 },
            );
          }

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

        const payment = await trace(
          { name: 'createPayment', op: 'db.query' },
          () =>
            finalPrice === 0 && promoCode
              ? supabaseRepository.payments.create(
                  'N/A',
                  'free',
                  promoCode.id,
                )
              : supabaseRepository.payments.create(
                  'N/A',
                  'mercadopago',
                  promoCode?.id,
                ),
        );

        let order = await trace(
          { name: 'createOrder', op: 'db.query' },
          () =>
            supabaseRepository.orders.create(
              body.product_id,
              user.id,
              payment.id,
            ),
        );

        if (finalPrice === 0 && promoCode) {
          order = await trace(
            { name: 'completeFreeOrder', op: 'db.query' },
            async () => {
              const updatedOrder =
                await supabaseRepository.orders.updateStatus(
                  order.id,
                  'completed',
                );
              await supabaseRepository.promos.incrementUsage(promoCode!.id);
              await supabaseRepository.payments.update(payment.id, {
                status: 'approved',
              });
              return updatedOrder;
            },
          );

          logger.info('Free order completed', {
            orderId: order.id,
            productId: body.product_id,
            promoCodeId: promoCode.id,
            originalPrice: product.price,
            finalPrice: 0,
          });

          return Response.json({ order });
        } else {
          const paymentUrl = await trace(
            { name: 'generateMercadoPagoUrl', op: 'http.client' },
            () =>
              MercadoPagoRepository().generatePaymentUrl(product, user, {
                orderId: order.id,
              }),
          );

          logger.info('Order created, redirecting to payment', {
            orderId: order.id,
            productId: body.product_id,
            productName: product.name,
            finalPrice,
            originalPrice: product.price,
            paymentProvider: 'mercadopago',
            hasPromoCode: !!promoCode,
          });

          return Response.json({ paymentUrl, order });
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          return Response.json(
            { message: 'Invalid request', errors: error.errors },
            { status: 400 },
          );
        }

        logCriticalError(error, 'order-creation', {
          productId: reqBody?.product_id ?? 'unknown',
          email: reqBody?.email ?? 'unknown',
          hasPromoCode: !!reqBody?.promo_code_id,
        });

        return Response.json(
          { message: 'Internal server error' },
          { status: 500 },
        );
      }
    },
  );
}
