import mercadopagoClient from '../client';

export default async function getPaymentById(paymentId: string) {
  const response = await mercadopagoClient.get(
    `${process.env.MERCADOPAGO_PAYMENTS_PATH}/${paymentId}`
  );

  return response.data;
}
