'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@soybelumont/ui/components/sheet';
import { OrderWithDetails } from '@modules/orders/types';
import { OrderDetailPanel } from '@modules/orders/components/OrderDetailPanel';

interface OrdersSheetWrapperProps {
  orders: OrderWithDetails[];
}

export function OrdersSheetWrapper({ orders }: OrdersSheetWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const selectedOrder = orderId
    ? (orders.find((o) => o.id === orderId) ?? null)
    : null;

  const isOpen = selectedOrder !== null;

  function handleClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('orderId');
    const qs = params.toString();
    router.push(qs ? `?${qs}` : '?');
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalle de la Orden</SheetTitle>
        </SheetHeader>
        {selectedOrder && <OrderDetailPanel order={selectedOrder} />}
      </SheetContent>
    </Sheet>
  );
}
