import { Database } from '@core/data/supabase/types/supabase';

export type OrderStatus = Database['public']['Enums']['order_status'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type PaymentProvider = Database['public']['Enums']['payment_provider'];

// Params for getAllOrdersWithFilters
export interface OrderFiltersParams {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  clientSearch?: string;
  productId?: string;
  page?: number; // 1-indexed, default: 1
  pageSize?: number; // default: 20
}

// Promo code embedded in payment
export interface PromoCodeEmbedded {
  code: string;
  discount_type: string;
  discount_value: number;
}

// Payment embedded in order
export interface PaymentEmbedded {
  id: string;
  amount: number;
  provider: PaymentProvider;
  provider_id: string | null;
  status: PaymentStatus;
  promo_code_id: string | null;
  promo_codes: PromoCodeEmbedded | null;
}

// Full order with all joined details for the list view
export interface OrderWithDetails {
  id: string;
  created_at: Date;
  updated_at: Date;
  status: OrderStatus;
  payment_id: string | null;
  product_id: string;
  user_id: string;
  users: {
    name: string;
    email: string;
  } | null;
  products: {
    id: string;
    name: string;
    price: number;
    product_type: string;
  } | null;
  payments: PaymentEmbedded | null;
}

// Expanded order for detail view (same shape, used for getOrderByIdExpanded)
export interface OrderDetailExpanded {
  id: string;
  created_at: Date;
  updated_at: Date;
  status: OrderStatus;
  payment_id: string | null;
  users: {
    name: string;
    email: string;
  } | null;
  products: {
    name: string;
    price: number;
    product_type: string;
  } | null;
  payments: {
    id: string;
    amount: number;
    provider: PaymentProvider;
    provider_id: string | null;
    status: PaymentStatus;
    promo_codes: PromoCodeEmbedded | null;
  } | null;
}

// MercadoPago payment detail from external API (on-demand)
export interface MpPaymentDetail {
  id: number | string;
  status: string;
  status_detail: string;
  payment_method_id: string;
  payment_type_id: string;
  installments: number;
  transaction_amount: number;
  date_approved: string | null;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
  card?: {
    first_six_digits?: string;
    last_four_digits?: string;
    expiration_month?: number;
    expiration_year?: number;
    cardholder?: {
      name?: string;
    };
  } | null;
}
