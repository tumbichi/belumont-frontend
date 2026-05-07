import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { KpiGrid } from '../components/KpiGrid';
import { KpiCardSkeleton } from '../components/KpiCardSkeleton';
import { calculatePercentageChange } from '../utils/period.utils';
import { ResolvedDateRange } from '../types';

interface KpiSectionProps {
  dateRange: ResolvedDateRange;
  previousDateRange: ResolvedDateRange;
  totalUsers: number;
}

export async function KpiSection({
  dateRange,
  previousDateRange,
  totalUsers,
}: KpiSectionProps) {
  const repository = SupabaseRepository();

  const [current, previous] = await Promise.all([
    repository.dashboard.getKpis(dateRange),
    repository.dashboard.getKpisForComparison(previousDateRange),
  ]);

  const currentAvgTicket =
    current.orders > 0 ? Math.round(current.revenue / current.orders) : 0;
  const previousAvgTicket =
    previous.orders > 0 ? Math.round(previous.revenue / previous.orders) : 0;

  const revenuePct = calculatePercentageChange(
    current.revenue,
    previous.revenue
  );
  const ordersPct = calculatePercentageChange(current.orders, previous.orders);
  const avgTicketPct = calculatePercentageChange(
    currentAvgTicket,
    previousAvgTicket
  );

  // Build the comparison label from the previous period label
  const comparisonLabel = `vs ${previousDateRange.label}`;

  // For all_time there is no meaningful comparison period
  const isAllTime = dateRange.label === 'todos los tiempos';

  return (
    <KpiGrid
      revenue={current.revenue}
      orders={current.orders}
      avgTicket={currentAvgTicket}
      totalUsers={totalUsers}
      period={comparisonLabel}
      comparison={
        isAllTime ? undefined : { revenuePct, ordersPct, avgTicketPct }
      }
    />
  );
}

export function KpiSectionSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <KpiCardSkeleton />
      <KpiCardSkeleton />
      <KpiCardSkeleton />
      <KpiCardSkeleton />
    </div>
  );
}
