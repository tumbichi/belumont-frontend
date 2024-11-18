import { Database } from "@core/data/supabase/types/supabase";
import { createOrder } from "./services/createOrder";
import updateOrderStatus from "./services/updateOrderStatus";
import getOrderById from "./services/getOrderById";

export type OrderStatus = Database["public"]["Enums"]["order_status"];

export interface Order {
  created_at: Date;
  id: string;
  product_id: string;
  status: OrderStatus;
  updated_at: Date;
  user_id: string;
}

export interface OrdersRepositoryReturn {
  create: (productId: string, userId: string) => Promise<Order>;
  getById: (id: string) => Promise<Order | null>;
  updateStatus: (id: string, status: OrderStatus) => Promise<Order>;
}

export const OrdersRepository = (): OrdersRepositoryReturn => ({
  create: createOrder,
  getById: getOrderById,
  updateStatus: updateOrderStatus,
});
