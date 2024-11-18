import { Product } from "../supabase/products";
import { User } from "../supabase/users";
import { generatePaymentUrl } from "./services/generatePaymentUrl";
import getPaymentById from "./services/getPaymentById";
import { MercadoPagoPayment } from "./types/MercadoPagoPayment";

export interface PaymentMetadata {
  orderId: string;
}

interface MercadoPagoRepositoryReturn {
  generatePaymentUrl: (product: Product, user: User, metadata: PaymentMetadata) => Promise<string>;
  getPaymentById: (id: string) => Promise<MercadoPagoPayment>;
}

export const MercadoPagoRepository = (): MercadoPagoRepositoryReturn => ({ generatePaymentUrl, getPaymentById });
