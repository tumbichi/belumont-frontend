import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { BestSellersTable } from '../components/BestSellersTable';
import { ResolvedDateRange } from '../types';

interface BestSellersSectionProps {
  dateRange: ResolvedDateRange;
}

export async function BestSellersSection({
  dateRange,
}: BestSellersSectionProps) {
  const repository = SupabaseRepository();
  const rows = await repository.dashboard.getBestSellers({
    ...dateRange,
    limit: 5,
  });

  return <BestSellersTable rows={rows} periodLabel={dateRange.label} />;
}
