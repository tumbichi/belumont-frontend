import { mpFetch } from '../client';
import { MpPaymentDetail } from '@modules/orders/types';

const MP_PAYMENTS_PATH =
  process.env.MERCADOPAGO_PAYMENTS_PATH ?? '/v1/payments';

export async function getPaymentById(
  paymentId: string
): Promise<MpPaymentDetail> {
  return mpFetch<MpPaymentDetail>(`${MP_PAYMENTS_PATH}/${paymentId}`);
}
