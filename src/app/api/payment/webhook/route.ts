import { MercadoPagoRepository } from "@core/data/mercadopago/mercadopago.repository";
import ResendRepository from "@core/data/resend/resend.repository";
import updateOrderStatus from "@core/data/supabase/orders/services/updateOrderStatus";
import SupabaseRepository from "@core/data/supabase/supabase.repository";
import { isAxiosError } from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("body", body);
  const supabaseRepository = SupabaseRepository();

  const mpPayment = await MercadoPagoRepository().getPaymentById(body.data.id);
  console.log("payment", mpPayment);

  const { order_id: orderId, product_id: productId } = mpPayment.metadata;

  let payment = await supabaseRepository.payments.create(orderId, body.data.id);

  switch (mpPayment.status) {
    case "approved":
    case "authorized":
    case "in_process":
    case "in_mediation":
    case "pending":
    case "cancelled":
    case "charged_back":
    case "refunded":
    case "rejected": {
      payment = await supabaseRepository.payments.updateStatus(payment.id, mpPayment.status);
      break;
    }
    default: {
      throw new Error("Invalid payment status");
    }
  }

  if (payment.status === "approved") {
    const order = await supabaseRepository.orders.updateStatus(orderId, "paid");
    const product = await supabaseRepository.products.getById(productId);
    const user = await supabaseRepository.users.getById(order.user_id);

    if (!user) {
      throw new Error("User does not exist");
    }

    if (!product) {
      throw new Error("Product does not exist");
    }

    ResendRepository()
      .sendEmail({
        to: user.email,
        from: String(process.env.RESEND_FROM_EMAIL),
        subject: `${product.name} | @soybelumont`,
        html: `<div>
                <h1>Gracias por tu compra de: ${product?.name}</h1>
                <p>El producto se encuentra adjunto a este email</p>
              </div>`,
      })
      .then(() => {
        updateOrderStatus(order.id, "completed");
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          console.log("error", error.response);
        } else {
          console.log("error", error);
        }
      });
  }

  return Response.json({ payment });
}
