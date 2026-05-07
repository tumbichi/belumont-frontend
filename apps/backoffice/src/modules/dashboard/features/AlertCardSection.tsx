import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { AlertCard } from '../components/AlertCard';

export async function AlertCardSection() {
  const repository = SupabaseRepository();
  const orders = await repository.dashboard.getStuckPaidOrders(10);

  if (orders.length === 0) return null;

  return <AlertCard orders={orders} />;
}
