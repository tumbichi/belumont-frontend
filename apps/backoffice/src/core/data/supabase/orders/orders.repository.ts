import { Database } from '@core/data/supabase/types/supabase';
import { createOrder } from './services/createOrder';
import updateOrderStatus from './services/updateOrderStatus';
import getOrderById from './services/getOrderById';
import getAllOrders, {
  OrderWithDetails as LegacyOrderWithDetails,
} from './services/getAllOrders';
import getAllOrdersWithFilters from './services/getAllOrdersWithFilters';
import getOrderByIdExpanded from './services/getOrderByIdExpanded';
import getTotalSales from './services/getTotalSales';
import getTotalOrders from './services/getTotalOrders';
import {
  OrderFiltersParams,
  OrderWithDetails,
  OrderDetailExpanded,
} from '@modules/orders/types';

export type OrderStatus = Database['public']['Enums']['order_status'];
export interface Order {
  created_at: Date;
  id: string;
  product_id: string;
  status: OrderStatus;
  updated_at: Date;
  user_id: string;
}

export type { LegacyOrderWithDetails };

export interface OrdersRepositoryReturn {
  create: (productId: string, userId: string) => Promise<Order>;
  getById: (id: string) => Promise<Order | null>;
  getAll: () => Promise<LegacyOrderWithDetails[]>;
  getAllWithFilters: (
    params?: OrderFiltersParams
  ) => Promise<{ data: OrderWithDetails[]; total: number }>;
  getByIdExpanded: (id: string) => Promise<OrderDetailExpanded | null>;
  updateStatus: (id: string, status: OrderStatus) => Promise<Order>;
  getTotal: () => Promise<number>;
  getTotalSales: () => Promise<number>;
}

export const OrdersRepository = (): OrdersRepositoryReturn => ({
  create: createOrder,
  getById: getOrderById,
  getAll: getAllOrders,
  getAllWithFilters: getAllOrdersWithFilters,
  getByIdExpanded: getOrderByIdExpanded,
  updateStatus: updateOrderStatus,
  getTotal: getTotalOrders,
  getTotalSales: getTotalSales,
});
