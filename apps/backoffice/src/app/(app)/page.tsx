import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { periodFilterSchema } from '@modules/dashboard/schemas/periodFilter.schema';
import {
  presetToDateRange,
  getPreviousPeriod,
} from '@modules/dashboard/utils/period.utils';
import { DashboardPage } from '@modules/dashboard/features/DashboardPage';

export default async function DashboardRoute({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = periodFilterSchema.safeParse(params);
  const period = parsed.success
    ? parsed.data
    : { period: 'this_month' as const };

  const dateRange = presetToDateRange(period);
  const previousDateRange = getPreviousPeriod(dateRange);

  const repository = SupabaseRepository();
  const totalUsers = await repository.dashboard.getTotalUsers();

  return (
    <DashboardPage
      period={period}
      dateRange={dateRange}
      previousDateRange={previousDateRange}
      totalUsers={totalUsers}
    />
  );
}
