'use server';

import { getPaymentById } from '@core/data/mercadopago/services/getPaymentById';
import { MpPaymentDetail } from '@modules/orders/types';

export type GetMpPaymentDetailResult =
  | { ok: true; data: MpPaymentDetail }
  | { ok: false; error: string };

export async function getMpPaymentDetail(
  providerId: string
): Promise<GetMpPaymentDetailResult> {
  try {
    const data = await getPaymentById(providerId);
    return { ok: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Error desconocido al llamar a MP';
    return { ok: false, error: message };
  }
}
