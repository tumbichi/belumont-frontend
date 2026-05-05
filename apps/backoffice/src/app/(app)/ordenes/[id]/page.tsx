import { Metadata } from 'next';
import OrderDetailPage from '@modules/orders/features/OrderDetailPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Detalle de Orden',
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailPage id={id} />;
}
