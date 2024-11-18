import { MercadoPagoRepository } from "@core/data/mercadopago/mercadopago.repository";
import SupabaseRepository from "@core/data/supabase/supabase.repository";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("mpBody", body);
  const supabaseRepository = SupabaseRepository();

  const mpPayment = await MercadoPagoRepository().getPaymentById(body.data.id);
  console.log("mpPayment", mpPayment);

  const { order_id: orderId } = mpPayment.metadata;

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

  return Response.json({ payment });
}
