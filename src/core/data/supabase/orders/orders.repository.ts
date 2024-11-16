import { Database } from "@core/types/supabase";
import { createOrder } from "./services/createOrder";

export type OrderStatus = Database["public"]["Enums"]["order_status"];

export interface Order {
  created_at: Date;
  id: string;
  product_id: string;
  status: OrderStatus;
  updated_at: Date;
  user_id: string;
}

interface OrdersRepositoryReturn {
  create: (productId: string, userId: string) => Promise<Order>;
}

export const OrdersRepository = (): OrdersRepositoryReturn => ({
  create: createOrder,
});
