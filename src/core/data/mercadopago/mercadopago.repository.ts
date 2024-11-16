import { generatePaymentUrl } from "./services/generatePaymentUrl";

export interface PaymentMetadata {
  email: string;
}

interface MercadoPagoRepositoryReturn {
  generatePaymentUrl: (metadata: PaymentMetadata) => Promise<string>;
}

export const MercadoPagoRepository = (): MercadoPagoRepositoryReturn => ({ generatePaymentUrl });
