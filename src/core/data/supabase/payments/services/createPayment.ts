import { supabase } from "@core/data/client";
import sanatizeDatesFromObject from "@core/utils/helpers/sanatizeDatesFromObject";
import { Payment } from "../payments.repository";

export async function createPayment(orderId: string, providerId: string): Promise<Payment> {
  const { data, error } = await supabase
    .from("payments")
    .insert({ order_id: orderId, provider: "mercadopago", provider_id: providerId })
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length <= 0) {
    throw new Error("Failed to create payment");
  }

  return sanatizeDatesFromObject(data[0]);
}
