import crypto from 'crypto';

import { MercadoPagoRepository } from '@core/data/mercadopago/mercadopago.repository';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { captureCriticalError } from '@core/lib/sentry';
import {
  logger,
  trace,
  logCriticalError,
  setRequestAttributes,
} from '@core/lib/sentry-logger';
import { isAxiosError } from 'axios';

function verifySignature(
  xSignature: string,
  xRequestId: string,
  paymentId: string,
): boolean {
  const xSignatureArr = xSignature.split(',');

  if (!xSignatureArr[0] || !xSignatureArr[1]) {
    return false;
  }

  const ts = xSignatureArr[0].replace('ts=', '');
  const signaturePaymentHash = xSignatureArr[1].replace('v1=', '');

  const secret = (process.env.MERCADOPAGO_PAYMENT_SECRET_KEY || '').trim();
  const template = Buffer.from(
    `id:${paymentId};request-id:${xRequestId};ts:${ts};`,
    'utf8',
  ).toString();

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(template);

  const sha256Signature = hmac.digest('hex');

  const expectedSignature = Buffer.from(sha256Signature, 'hex');
  const providedSignature = Buffer.from(signaturePaymentHash, 'hex');

  if (expectedSignature.length !== providedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedSignature, providedSignature);
}

export async function POST(request: Request) {
  const xSignature = request.headers.get('x-signature');
  const xRequestId = request.headers.get('x-request-id');

  let body: { data: { id: string }; action?: string; type?: string };

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  if (!xSignature || !xRequestId) {
    logger.warn('Payment webhook: missing signature headers');
    return Response.json(
      { message: 'Missing payment signature headers' },
      { status: 401 },
    );
  }

  const paymentId = body.data.id;

  setRequestAttributes({
    'webhook.paymentId': paymentId,
    'webhook.action': body.action ?? 'unknown',
    'webhook.type': body.type ?? 'unknown',
  });

  return trace(
    {
      name: 'POST /api/payment/webhook',
      op: 'http.server',
      attributes: { 'payment.id': paymentId },
    },
    async () => {
      const signatureValid = trace(
        { name: 'verifyHmacSignature', op: 'function' },
        () => verifySignature(xSignature, xRequestId, paymentId),
      );

      if (!signatureValid) {
        logger.warn('Payment webhook: invalid signature', {
          paymentId,
        });
        return Response.json(
          { message: 'Invalid payment signature' },
          { status: 401 },
        );
      }

      try {
        const supabaseRepository = SupabaseRepository();

        let mpPayment;

        try {
          mpPayment = await trace(
            { name: 'getMercadoPagoPayment', op: 'http.client' },
            () => MercadoPagoRepository().getPaymentById(paymentId),
          );
        } catch (error) {
          logCriticalError(error, 'payment-webhook', {
            paymentId,
            action: body.action ?? 'unknown',
            step: 'getPaymentById',
          });

          captureCriticalError(error, 'payment-webhook', {
            paymentId,
            action: body.action,
            step: 'getPaymentById',
          });

          if (isAxiosError(error)) {
            return Response.json(
              { message: error.message },
              { status: error.response?.status || 500 },
            );
          }

          return Response.json(
            { message: 'Failed to fetch payment from MercadoPago' },
            { status: 500 },
          );
        }

        const { order_id: orderId } = mpPayment.metadata;

        const order = await trace(
          { name: 'getOrderById', op: 'db.query' },
          () => supabaseRepository.orders.getById(orderId),
        );

        if (!order || !order.payment_id) {
          logCriticalError(
            new Error('Order not found for approved payment'),
            'payment-webhook',
            {
              paymentId,
              orderId: orderId ?? 'unknown',
              hasPaymentId: !!order?.payment_id,
            },
          );

          captureCriticalError(
            new Error('Order not found for approved payment'),
            'payment-webhook',
            {
              paymentId,
              orderId,
              hasPaymentId: !!order?.payment_id,
              note: 'URGENTE: El usuario posiblemente pagó pero la orden no se encontró',
            },
          );

          return Response.json(
            { message: 'Order not found' },
            { status: 404 },
          );
        }

        const payment = await trace(
          { name: 'updatePaymentStatus', op: 'db.query' },
          () =>
            supabaseRepository.payments.update(order.payment_id!, {
              provider_id: paymentId,
              status: mpPayment.status,
              amount: mpPayment.transaction_amount,
            }),
        );

        logger.info('Payment webhook processed', {
          paymentId,
          orderId,
          mpStatus: mpPayment.status,
          amount: mpPayment.transaction_amount,
        });

        return Response.json({ payment });
      } catch (error) {
        logCriticalError(error, 'payment-webhook', {
          paymentId,
          action: body.action ?? 'unknown',
          type: body.type ?? 'unknown',
        });

        captureCriticalError(error, 'payment-webhook', {
          paymentId,
          action: body.action,
          type: body.type,
          note: 'URGENTE: Error no manejado en webhook de pago',
        });

        return Response.json(
          { message: 'Internal server error' },
          { status: 500 },
        );
      }
    },
  );
}
