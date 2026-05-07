import { supabase } from '@core/data/supabase/client';
import { EXCLUDED_USER_IDS } from '@core/constants/excluded-users';
import {
  BestSellingProductRow,
  DateRangeParams,
} from '@modules/dashboard/types';

export interface BestSellingProductsParams extends DateRangeParams {
  limit?: number;
}

interface RpcBestSellingProductRow {
  product_id: string;
  product_name: string;
  product_type: string;
  sales_count: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRpc = (fn: string, args: Record<string, unknown>) => any;

export default async function getBestSellingProductsForPeriod(
  params: BestSellingProductsParams
): Promise<BestSellingProductRow[]> {
  // Cast required: get_best_selling_products RPC is not yet in the generated Database types
  // (migration pending manual apply). Remove cast after running the migration.
  const { data, error } = await (supabase.rpc as unknown as AnyRpc)(
    'get_best_selling_products',
    {
      p_from: `${params.from}T00:00:00.000Z`,
      p_to: `${params.to}T23:59:59.999Z`,
      p_excluded_ids: EXCLUDED_USER_IDS,
      p_limit: params.limit ?? 5,
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return (data as RpcBestSellingProductRow[]).map((row) => ({
    product_id: row.product_id,
    product_name: row.product_name,
    product_type: row.product_type,
    sales_count: row.sales_count,
  }));
}
