import crypto from 'crypto';

import { MercadoPagoRepository } from '@core/data/mercadopago/mercadopago.repository';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { captureCriticalError } from '@core/lib/sentry';
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

  return sha256Signature === signaturePaymentHash;
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
    return Response.json(
      { message: 'Missing payment signature headers' },
      { status: 401 },
    );
  }

  if (!verifySignature(xSignature, xRequestId, body.data.id)) {
    return Response.json(
      { message: 'Invalid payment signature' },
      { status: 401 },
    );
  }

  const paymentId = body.data.id;

  try {
    const supabaseRepository = SupabaseRepository();

    let mpPayment;

    try {
      mpPayment = await MercadoPagoRepository().getPaymentById(paymentId);
    } catch (error) {
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

    const order = await supabaseRepository.orders.getById(orderId);

    if (!order || !order.payment_id) {
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

    const payment = await supabaseRepository.payments.update(
      order.payment_id,
      {
        provider_id: paymentId,
        status: mpPayment.status,
        amount: mpPayment.transaction_amount,
      },
    );

    return Response.json({ payment });
  } catch (error) {
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
}
