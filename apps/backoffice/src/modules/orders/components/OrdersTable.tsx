'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import { Badge } from '@soybelumont/ui/components/badge';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrderWithDetails } from '@modules/orders/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PriceDisplay } from './PriceDisplay';

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function truncateId(id: string): string {
  return id.substring(0, 8) + '…';
}

interface OrdersTableProps {
  orders: OrderWithDetails[];
}

const COLUMNS = [
  'ID',
  'Cliente',
  'Producto',
  'Fecha',
  'Estado',
  'Precio',
  'Promo',
];

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleRowClick(orderId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('orderId', orderId);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMNS.length}
                className="text-center text-muted-foreground py-8"
              >
                No se encontraron órdenes.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const payment = order.payments;
              const isFree = payment?.provider === 'free';
              const hasPromoCode = !!payment?.promo_codes;
              const isApproved =
                payment?.status === 'approved' ||
                order.status === 'completed' ||
                order.status === 'paid';
              const promoCode = payment?.promo_codes?.code;

              return (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors duration-150"
                  onClick={() => handleRowClick(order.id)}
                >
                  {/* ID */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {truncateId(order.id)}
                  </TableCell>

                  {/* Cliente */}
                  <TableCell>
                    {order.users ? (
                      <div>
                        <div className="font-medium text-sm leading-snug">
                          {order.users.name}
                        </div>
                        <div className="text-xs text-muted-foreground leading-snug">
                          {order.users.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>

                  {/* Producto */}
                  <TableCell className="text-sm">
                    {order.products?.name ?? (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>

                  {/* Fecha */}
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(order.created_at)}
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>

                  {/* Precio */}
                  <TableCell>
                    <PriceDisplay
                      productPrice={order.products?.price}
                      amount={payment?.amount}
                      isFree={isFree}
                      hasPromoCode={hasPromoCode}
                      isApproved={isApproved}
                      compact
                    />
                  </TableCell>

                  {/* Promo */}
                  <TableCell>
                    {promoCode ? (
                      <Badge
                        variant="outline"
                        className="font-mono text-xs bg-amber-50 text-amber-800 border-amber-200"
                      >
                        {promoCode}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
