import { supabase } from "@core/data/client";
import sanatizeDatesFromObject from "@core/utils/helpers/sanatizeDatesFromObject";
import { Order } from "../orders.repository";

export default async function getOrderById(id: string): Promise<Order | null> {
  const { data } = await supabase.from("orders").select().eq("id", id);

  return data && data.length > 0 ? sanatizeDatesFromObject(data[0]) : null;
}
