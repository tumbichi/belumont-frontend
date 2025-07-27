import crypto from 'crypto';

import { MercadoPagoRepository } from '@core/data/mercadopago/mercadopago.repository';
import SupabaseRepository from '@core/data/supabase/supabase.repository';

function verifySignature(
  xSignature: string,
  xRequestId: string,
  paymentId: string
): true | never {
  console.log('x-signature', xSignature);
  console.log('x-request-id', xRequestId);
  const xSignatureArr = xSignature.split(',');

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

  /* if (hmacSHA256Signature !== signaturePaymentHash) {
    throw new Error('Invalid payment signature');
  } */

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
    const supabaseRepository = SupabaseRepository();

    const mpPayment = await MercadoPagoRepository().getPaymentById(
      body.data.id
    );
    console.log('mpPayment', mpPayment);

    const { order_id: orderId } = mpPayment.metadata;

    let payment = await supabaseRepository.payments.create(
      orderId,
      body.data.id
    );

    switch (mpPayment.status) {
      case 'approved':
      case 'authorized':
      case 'in_process':
      case 'in_mediation':
      case 'pending':
      case 'cancelled':
      case 'charged_back':
      case 'refunded':
      case 'rejected': {
        payment = await supabaseRepository.payments.updateStatus(
          payment.id,
          mpPayment.status
        );
        break;
      }
      default: {
        throw new Error('Invalid payment status');
      }
    }

    return Response.json({ payment });
  }
}
