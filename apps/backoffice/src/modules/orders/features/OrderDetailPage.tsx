import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@soybelumont/ui/components/button';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { OrderDetailFull } from '@modules/orders/components/OrderDetailFull';

interface OrderDetailPageProps {
  id: string;
}

export default async function OrderDetailPage({ id }: OrderDetailPageProps) {
  const repository = SupabaseRepository();
  const order = await repository.orders.getByIdExpanded(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/ordenes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Detalle de la Orden</h1>
          <p className="text-sm text-muted-foreground font-mono">{id}</p>
        </div>
      </div>

      <OrderDetailFull order={order} />
    </div>
  );
}
