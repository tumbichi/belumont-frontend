import { PeriodPreset } from './schemas/periodFilter.schema';

export interface DateRangeParams {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export interface ResolvedDateRange {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  label: string;
}

export interface DashboardKpisResult {
  revenue: number;
  orders: number;
}

export interface BestSellingProductRow {
  product_id: string;
  product_name: string;
  product_type: string;
  sales_count: number;
}

export interface StuckPaidOrder {
  id: string;
  updated_at: string;
  minutesElapsed: number;
}

export type { PeriodPreset };
