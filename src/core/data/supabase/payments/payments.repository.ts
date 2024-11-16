import { Database } from "@core/types/supabase";
import { createPayment } from "./services/createPayment";

export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type PaymentProvider = Database["public"]["Enums"]["payment_provider"]

export interface Payment {
  created_at: Date;
  id: string;
  order_id: string;
  provider: PaymentProvider;
  provider_id: string;
  status: PaymentStatus;
  updated_at: Date;
}

interface PaymentsRepositoryReturn {
  create: (productId: string, userId: string) => Promise<Payment>;
}

export const PaymentsRepository = (): PaymentsRepositoryReturn => ({
  create: createPayment,
});
