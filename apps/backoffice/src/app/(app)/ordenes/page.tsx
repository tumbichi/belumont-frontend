import { getTranslations } from 'next-intl/server';
import OrdersList from '@modules/orders/features/OrdersList';

interface OrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const t = await getTranslations();
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('ORDERS.TITLE')}</h1>
      <OrdersList searchParams={params} />
    </div>
  );
}
