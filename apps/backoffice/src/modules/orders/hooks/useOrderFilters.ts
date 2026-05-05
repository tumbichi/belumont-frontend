'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  ORDER_STATUS_VALUES,
  PAYMENT_STATUS_VALUES,
  orderFiltersSchema,
  type OrderFilters,
} from '@modules/orders/schemas/orderFilters.schema';

export function useOrderFilters(): {
  filters: OrderFilters;
  setFilter: (key: keyof OrderFilters, value: unknown) => void;
  clearFilters: () => void;
} {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current URL params into OrderFilters
  const rawParams: Record<string, unknown> = {};
  const statusValues = searchParams.getAll('status');
  const paymentStatusValues = searchParams.getAll('paymentStatus');

  if (statusValues.length > 0) rawParams.status = statusValues;
  if (paymentStatusValues.length > 0)
    rawParams.paymentStatus = paymentStatusValues;

  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const clientSearch = searchParams.get('clientSearch');
  const productId = searchParams.get('productId');
  const page = searchParams.get('page');
  const orderId = searchParams.get('orderId');

  if (dateFrom) rawParams.dateFrom = dateFrom;
  if (dateTo) rawParams.dateTo = dateTo;
  if (clientSearch) rawParams.clientSearch = clientSearch;
  if (productId) rawParams.productId = productId;
  if (page) rawParams.page = page;
  if (orderId) rawParams.orderId = orderId;

  const result = orderFiltersSchema.safeParse(rawParams);
  const filters: OrderFilters = result.success ? result.data : { page: 1 };

  const setFilter = useCallback(
    (key: keyof OrderFilters, value: unknown) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      params.delete('page'); // reset pagination

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else if (value != null && value !== '') {
        params.set(key, String(value));
      }

      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const clearFilters = useCallback(() => {
    router.push('?');
  }, [router]);

  return { filters, setFilter, clearFilters };
}
