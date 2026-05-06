import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { orderFiltersSchema } from '@modules/orders/schemas/orderFilters.schema';
import { OrdersTable } from '@modules/orders/components/OrdersTable';
import { OrdersFilters } from '@modules/orders/components/OrdersFilters';
import { OrdersPagination } from '@modules/orders/components/OrdersPagination';
import { OrdersSheetWrapper } from './OrdersSheetWrapper';

const PAGE_SIZE = 20;

interface OrdersListProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>
) {
  const raw: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) {
      raw[key] = value;
    }
  }

  // Multi-value array params
  if (searchParams.status) {
    raw.status = Array.isArray(searchParams.status)
      ? searchParams.status
      : [searchParams.status];
  }
  if (searchParams.paymentStatus) {
    raw.paymentStatus = Array.isArray(searchParams.paymentStatus)
      ? searchParams.paymentStatus
      : [searchParams.paymentStatus];
  }
  if (searchParams.productIds) {
    raw.productIds = Array.isArray(searchParams.productIds)
      ? searchParams.productIds
      : [searchParams.productIds];
  }

  const result = orderFiltersSchema.safeParse(raw);
  return result.success ? result.data : { page: 1 };
}

export default async function OrdersList({ searchParams }: OrdersListProps) {
  const repository = SupabaseRepository();
  const filters = parseSearchParams(searchParams);

  const [{ data: orders, total }, products] = await Promise.all([
    repository.orders.getAllWithFilters({
      status: filters.status as
        | import('@modules/orders/types').OrderStatus[]
        | undefined,
      paymentStatus: filters.paymentStatus as
        | import('@modules/orders/types').PaymentStatus[]
        | undefined,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      clientSearch: filters.clientSearch,
      productIds: filters.productIds,
      hideFree: filters.hideFree,
      page: filters.page,
      pageSize: PAGE_SIZE,
    }),
    repository.products.getAllForBackoffice(),
  ]);

  const productOptions = products.map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="space-y-4">
      <OrdersFilters products={productOptions} />

      {/* Always-visible result count */}
      <p className="text-sm text-muted-foreground">
        {total} {total === 1 ? 'orden encontrada' : 'órdenes encontradas'}
      </p>

      <OrdersTable orders={orders} />

      <OrdersPagination
        page={filters.page}
        total={total}
        pageSize={PAGE_SIZE}
      />

      <OrdersSheetWrapper orders={orders} />
    </div>
  );
}
