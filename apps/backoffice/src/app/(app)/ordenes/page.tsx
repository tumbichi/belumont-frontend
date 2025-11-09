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

async function getOrders(): Promise<OrderWithDetails[]> {
  const repository = SupabaseRepository();
  const orders = await repository.orders.getAll();
  return orders;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Órdenes</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID de Orden</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Fecha de creacion</TableHead>
              <TableHead>Estado de Orden</TableHead>
              <TableHead>Estado de Pago</TableHead>
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
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No se encontraron órdenes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
