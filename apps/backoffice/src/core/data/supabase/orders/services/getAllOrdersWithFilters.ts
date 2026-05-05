import { supabase } from '@core/data/supabase/client';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import {
  OrderFiltersParams,
  OrderWithDetails,
  PaymentStatus,
  OrderStatus,
} from '@modules/orders/types';

const PAGE_SIZE = 20;

export default async function getAllOrdersWithFilters(
  params: OrderFiltersParams = {}
): Promise<{ data: OrderWithDetails[]; total: number }> {
  const {
    status,
    paymentStatus,
    dateFrom,
    dateTo,
    clientSearch,
    productId,
    page = 1,
    pageSize = PAGE_SIZE,
  } = params;

  // Step 1: if clientSearch, resolve matching user_ids first
  let userIdFilter: string[] | null = null;
  if (clientSearch && clientSearch.trim().length > 0) {
    const term = `%${clientSearch.trim()}%`;
    const { data: matchingUsers } = await supabase
      .from('users')
      .select('id')
      .or(`name.ilike.${term},email.ilike.${term}`);

    userIdFilter = matchingUsers?.map((u) => u.id) ?? [];
    // If no users match, return empty early
    if (userIdFilter.length === 0) {
      return { data: [], total: 0 };
    }
  }

  // Step 2: build main query
  let query = supabase
    .from('orders')
    .select(
      `
      id,
      created_at,
      updated_at,
      status,
      payment_id,
      product_id,
      user_id,
      users (name, email),
      products (id, name, price, product_type),
      payments (
        id,
        amount,
        provider,
        provider_id,
        status,
        promo_code_id,
        promo_codes:promo_code (code, discount_type, discount_value)
      )
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false });

  // Apply filters
  if (status && status.length > 0) {
    query = query.in('status', status as OrderStatus[]);
  }

  if (dateFrom) {
    query = query.gte('created_at', dateFrom);
  }

  if (dateTo) {
    // Include the full day
    query = query.lte('created_at', `${dateTo}T23:59:59.999Z`);
  }

  if (productId) {
    query = query.eq('product_id', productId);
  }

  if (userIdFilter !== null) {
    query = query.in('user_id', userIdFilter);
  }

  // Pagination
  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  if (!data) {
    return { data: [], total: 0 };
  }

  // Apply paymentStatus filter in memory (Supabase doesn't support filtering on related table columns directly)
  let filtered = data;
  if (paymentStatus && paymentStatus.length > 0) {
    filtered = data.filter(
      (order) =>
        order.payments &&
        paymentStatus.includes(
          (order.payments as { status: PaymentStatus }).status
        )
    );
  }

  const sanitized = filtered.map((order) =>
    sanitizeDatesFromObject(order)
  ) as unknown as OrderWithDetails[];

  return { data: sanitized, total: count ?? 0 };
}
