import { z } from "zod";
import SupabaseRepository from "@core/data/supabase/supabase.repository";
import { MercadoPagoRepository } from "@core/data/mercadopago/mercadopago.repository";

const supabaseRepository = SupabaseRepository();

const bodySchema = z.object({
  email: z.string(),
  name: z.string(),
  productId: z.string(),
});

export async function POST(request: Request) {
  const reqBody = await request.json();
  const body = bodySchema.parse(reqBody);

  const product = await supabaseRepository.products.getById(body.productId);

  if (!product) {
    throw new Error("El producto no existe");
  }

  let user = await supabaseRepository.users.getByEmail(body.email);

  if (!user) {
    user = await supabaseRepository.users.create(body.email, body.name);
  }

  const order = await supabaseRepository.orders.create(body.productId, user.id);

  try {
    const paymentUrl = await MercadoPagoRepository().generatePaymentUrl(product, user, { orderId: order.id });
    return Response.json({ paymentUrl, order });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
