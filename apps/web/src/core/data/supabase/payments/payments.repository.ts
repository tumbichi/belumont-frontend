import { Database } from '@core/data/supabase/types/supabase';
import { createPayment } from './services/createPayment';
import updatePayment from './services/updatePayment';

export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type PaymentProvider = Database['public']['Enums']['payment_provider'];

export interface Payment {
  created_at: Date;
  id: string;
  provider: PaymentProvider;
  provider_id: string;
  status: PaymentStatus;
  updated_at: Date;
  promo_code_id: string | null;
}

export interface PaymentsRepositoryReturn {
  create: (
    providerId: string,
    provider?: PaymentProvider,
    promoCodeId?: string
  ) => Promise<Payment>;
  update: (
    id: string,
    payment: Partial<Pick<Payment, 'status' | 'provider_id'>>
  ) => Promise<Payment>;
}

export const PaymentsRepository = (): PaymentsRepositoryReturn => ({
  create: createPayment,
  update: updatePayment,
});
