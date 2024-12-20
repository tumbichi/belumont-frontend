import { Product } from '@core/data/supabase/products';
import { User } from '@core/data/supabase/users';
import mercadopagoClient from '../client';
import { PaymentMetadata } from '../mercadopago.repository';

export async function generatePaymentUrl(
  product: Product,
  user: User,
  metadata: PaymentMetadata
): Promise<string> {
  const response = await mercadopagoClient.post(
    String(process.env.MERCADOPAGO_PREFERENCES_PATH),
    {
      items: [
        {
          id: product.id,
          title: product.name,
          descripcion: product.description,
          unit_price: product.price,
          quantity: 1,
          currency_id: 'ARS',
          picture_url: product.image_url,
        },
      ],
      payer: {
        name: user.name,
        email: user.email,
      },
      auto_return: 'all',
      back_urls: {
        success: process.env.MERCADOPAGO_SUCCESS_URL,
        failure: `${process.env.MERCADOPAGO_CHECKOUT_URL}?productId=${product.id}&email=${user.email}&name=${user.name}&paymentStatus=failure`,
        pending: `${process.env.MERCADOPAGO_CHECKOUT_URL}?productId=${product.id}&email=${user.email}&name=${user.name}&paymentStatus=pending`,
      },
      metadata: {
        userId: user.id,
        productId: product.id,
        orderId: metadata.orderId,
      },
    }
  );

  console.log('mercadopago generatePaymentUrl', response.data);

  return response.data.init_point;
}
