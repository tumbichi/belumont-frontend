import crypto from 'crypto';

import { MercadoPagoRepository } from '@core/data/mercadopago/mercadopago.repository';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { isAxiosError } from 'axios';

function verifySignature(
  xSignature: string,
  xRequestId: string,
  paymentId: string
): true | never {
  console.log('x-signature', xSignature);
  console.log('x-request-id', xRequestId);
  const xSignatureArr = xSignature.split(',');

  if (!xSignatureArr[0] || !xSignatureArr[1]) {
    throw new Error('Invalid payment signature format');
  }

  const ts = xSignatureArr[0].replace('ts=', '');
  console.log('ts', ts);

  const signaturePaymentHash = xSignatureArr[1].replace('v1=', '');

  const secret = (process.env.MERCADOPAGO_PAYMENT_SECRET_KEY || '').trim();
  console.log('secret', secret);
  const template = Buffer.from(
    `id:${paymentId};request-id:${xRequestId};ts:${ts};`,
    'utf8'
  ).toString();
  console.log('template', template);

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(template);

  const sha256Signature = hmac.digest('hex');

  console.log('sha256Signature', sha256Signature);
  console.log('signaturePaymentHash', signaturePaymentHash);

  if (sha256Signature === signaturePaymentHash) {
    console.log('HMAC verified');
  } else {
    console.log('HMAC NOT verified');
  }

  return true;
}

export async function POST(request: Request) {
  console.log('request.headers', request.headers);

  const xSignature = request.headers.get('x-signature');
  const xRequestId = request.headers.get('x-request-id');
  const body = await request.json();
  console.log('mpBody', body);

  if (!xSignature || !xRequestId) {
    throw new Error('Invalid payment signature', {
      cause: {
        xSignature,
        xRequestId,
      },
    });
  }

  if (verifySignature(xSignature, xRequestId, body.data.id)) {
    let mpPayment;
    const supabaseRepository = SupabaseRepository();

    try {
      mpPayment = await MercadoPagoRepository().getPaymentById(body.data.id);
      console.log('mpPayment', mpPayment);
    } catch (error) {
      console.log('mercadopago.getPaymentById', error);
      if (isAxiosError(error)) {
        throw Response.json({
          message: error.message,
          cause: error.cause,
          response: error.response,
          status: error.response?.status || error.status,
        });
      }

      throw Response.json({ error }, { status: 500 });
    }

    const { order_id: orderId } = mpPayment.metadata;

    const order = await supabaseRepository.orders.getById(orderId);

    if (!order || !order.payment_id) {
      throw new Error('Order not found', {
        cause: { orderId, paymentId: order?.payment_id },
      });
    }

    const payment = await supabaseRepository.payments.update(order.payment_id, {
      provider_id: body.data.id,
      status: mpPayment.status,
    });

    return Response.json({ payment });
  }
}
