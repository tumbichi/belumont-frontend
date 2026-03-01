import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { OrderWithDetails } from '@core/data/supabase/orders/services/getAllOrders';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import formatDatetime from '@core/utils/formatters/formatDate';
import { getTranslations } from 'next-intl/server';

async function getOrders(): Promise<OrderWithDetails[]> {
  const repository = SupabaseRepository();
  const orders = await repository.orders.getAll();
  return orders;
}

export default async function OrdersPage() {
  const t = await getTranslations();
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('ORDERS.TITLE')}</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('ORDERS.ORDER_ID')}</TableHead>
              <TableHead>{t('ORDERS.CLIENT')}</TableHead>
              <TableHead>{t('ORDERS.PRODUCT')}</TableHead>
              <TableHead>{t('ORDERS.CREATED_AT')}</TableHead>
              <TableHead>{t('ORDERS.ORDER_STATUS')}</TableHead>
              <TableHead>{t('ORDERS.PAYMENT_STATUS')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    {order.users
                      ? `${order.users.name} (${order.users.email})`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {order.products ? order.products.name : 'N/A'}
                  </TableCell>
                  <TableCell>{formatDatetime(order.created_at)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.payments?.status || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  {t('ORDERS.NO_ORDERS')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
