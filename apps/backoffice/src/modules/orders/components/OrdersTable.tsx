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

function getOrderCells(order: OrderWithDetails) {
  const payment = order.payments;
  const isFree = payment?.provider === 'free';
  const hasPromoCode = !!payment?.promo_codes;
  const isApproved =
    payment?.status === 'approved' ||
    order.status === 'completed' ||
    order.status === 'paid';
  const promoCode = payment?.promo_codes?.code;
  return { payment, isFree, hasPromoCode, isApproved, promoCode };
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleRowClick(orderId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('orderId', orderId);
    router.push(`?${params.toString()}`);
  }

  if (orders.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground text-sm">
        No se encontraron órdenes.
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile: card list (hidden on md+) ──────────────────────── */}
      <div className="flex flex-col gap-2 md:hidden">
        {orders.map((order) => {
          const { payment, isFree, hasPromoCode, isApproved, promoCode } =
            getOrderCells(order);

          return (
            <button
              key={order.id}
              type="button"
              className="w-full text-left rounded-lg border bg-card px-4 py-3.5 space-y-2.5 hover:bg-muted/50 active:bg-muted transition-colors min-h-[72px]"
              onClick={() => handleRowClick(order.id)}
            >
              {/* Row 1: Client name + Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {order.users ? (
                    <>
                      <div className="font-medium text-sm leading-snug truncate">
                        {order.users.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {order.users.email}
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </div>
                <div className="shrink-0">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              {/* Row 2: Product name + Price */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground truncate min-w-0">
                  {order.products?.name ?? '—'}
                </span>
                <div className="shrink-0">
                  <PriceDisplay
                    productPrice={order.products?.price}
                    amount={payment?.amount}
                    isFree={isFree}
                    hasPromoCode={hasPromoCode}
                    isApproved={isApproved}
                    compact
                  />
                </div>
              </div>

              {/* Row 3: Date + Promo code */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {formatDate(order.created_at)}
                </span>
                {promoCode && (
                  <Badge
                    variant="outline"
                    className="font-mono text-xs bg-amber-50 text-amber-800 border-amber-200 shrink-0"
                  >
                    {promoCode}
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Desktop: table (visible on md+) ────────────────────────── */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const { payment, isFree, hasPromoCode, isApproved, promoCode } =
                getOrderCells(order);

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
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
