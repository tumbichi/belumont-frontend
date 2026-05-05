'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@soybelumont/ui/components/select';
import { Button } from '@soybelumont/ui/components/button';
import { Input } from '@soybelumont/ui/components/input';
import { DateRangePicker } from './DateRangePicker';
import {
  ORDER_STATUS_VALUES,
  PAYMENT_STATUS_VALUES,
} from '@modules/orders/schemas/orderFilters.schema';

interface Product {
  id: string;
  name: string;
}

interface OrdersFiltersProps {
  products: Product[];
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  authorized: 'Autorizado',
  in_process: 'En proceso',
  in_mediation: 'En mediación',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
  charged_back: 'Contracargo',
};

const ALL_VALUE = '__all__';

export function OrdersFilters({ products }: OrdersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clientSearch, setClientSearch] = useState(
    searchParams.get('clientSearch') ?? ''
  );

  // Debounce client search
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParam('clientSearch', clientSearch || null);
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSearch]);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const currentStatus = searchParams.get('status') ?? '';
  const currentPaymentStatus = searchParams.get('paymentStatus') ?? '';
  const currentProductId = searchParams.get('productId') ?? '';
  const currentDateFrom = searchParams.get('dateFrom')
    ? new Date(searchParams.get('dateFrom')! + 'T00:00:00')
    : undefined;
  const currentDateTo = searchParams.get('dateTo')
    ? new Date(searchParams.get('dateTo')! + 'T00:00:00')
    : undefined;

  function handleDateChange(range: { from?: Date; to?: Date }) {
    const params = new URLSearchParams(searchParams.toString());
    if (range.from) {
      params.set('dateFrom', range.from.toISOString().substring(0, 10));
    } else {
      params.delete('dateFrom');
    }
    if (range.to) {
      params.set('dateTo', range.to.toISOString().substring(0, 10));
    } else {
      params.delete('dateTo');
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  }

  function handleClearFilters() {
    setClientSearch('');
    router.push('?');
  }

  const hasFilters =
    currentStatus ||
    currentPaymentStatus ||
    currentProductId ||
    searchParams.get('dateFrom') ||
    searchParams.get('dateTo') ||
    clientSearch;

  return (
    <div className="flex flex-wrap gap-3 items-end">
      {/* Order status */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Estado</label>
        <Select
          value={currentStatus || ALL_VALUE}
          onValueChange={(val) =>
            updateParam('status', val === ALL_VALUE ? null : val)
          }
        >
          <SelectTrigger className="h-9 min-w-[150px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Todos los estados</SelectItem>
            {ORDER_STATUS_VALUES.map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABELS[s] ?? s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment status */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Estado de pago</label>
        <Select
          value={currentPaymentStatus || ALL_VALUE}
          onValueChange={(val) =>
            updateParam('paymentStatus', val === ALL_VALUE ? null : val)
          }
        >
          <SelectTrigger className="h-9 min-w-[170px]">
            <SelectValue placeholder="Todos los pagos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Todos los pagos</SelectItem>
            {PAYMENT_STATUS_VALUES.map((s) => (
              <SelectItem key={s} value={s}>
                {PAYMENT_STATUS_LABELS[s] ?? s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Producto</label>
        <Select
          value={currentProductId || ALL_VALUE}
          onValueChange={(val) =>
            updateParam('productId', val === ALL_VALUE ? null : val)
          }
        >
          <SelectTrigger className="h-9 min-w-[180px]">
            <SelectValue placeholder="Todos los productos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Todos los productos</SelectItem>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date range */}
      <DateRangePicker
        from={currentDateFrom}
        to={currentDateTo}
        onChange={handleDateChange}
      />

      {/* Client search */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Buscar cliente</label>
        <Input
          type="text"
          placeholder="Nombre o email..."
          value={clientSearch}
          onChange={(e) => setClientSearch(e.target.value)}
          className="h-9 min-w-[200px]"
        />
      </div>

      {/* Clear button */}
      {hasFilters && (
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="h-9 self-end"
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
