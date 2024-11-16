import { PaymentMetadata } from "../mercadopago.repository";

export async function generatePaymentUrl(metadata: PaymentMetadata): Promise<string> {
  return metadata.email;
}
