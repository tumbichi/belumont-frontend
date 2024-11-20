import { Database } from '@core/data/supabase/types/supabase';
import { createPayment } from './services/createPayment';
import updatePaymentStatus from './services/updatePaymentStatus';

export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type PaymentProvider = Database['public']['Enums']['payment_provider'];

export interface Payment {
  created_at: Date;
  id: string;
  order_id: string;
  provider: PaymentProvider;
  provider_id: string;
  status: PaymentStatus;
  updated_at: Date;
}

export interface PaymentsRepositoryReturn {
  create: (orderId: string, providerId: string) => Promise<Payment>;
  updateStatus: (id: string, status: PaymentStatus) => Promise<Payment>;
}

export const PaymentsRepository = (): PaymentsRepositoryReturn => ({
  create: createPayment,
  updateStatus: updatePaymentStatus,
});
