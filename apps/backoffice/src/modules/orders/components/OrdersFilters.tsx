'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@soybelumont/ui/components/select';
import { Button } from '@soybelumont/ui/components/button';
import { Input } from '@soybelumont/ui/components/input';
import { Switch } from '@soybelumont/ui/components/switch';
import { Checkbox } from '@soybelumont/ui/components/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@soybelumont/ui/components/popover';
import { cn } from '@soybelumont/ui/lib/utils';
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
  const [productPopoverOpen, setProductPopoverOpen] = useState(false);

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

  // ── Current filter values from URL ─────────────────────────────────────

  const currentStatus = searchParams.get('status') ?? '';
  const currentPaymentStatus = searchParams.get('paymentStatus') ?? '';
  const currentProductIds = searchParams.getAll('productIds');
  const currentHideFree = searchParams.get('hideFree') === 'true';

  const currentDateFrom = searchParams.get('dateFrom')
    ? new Date(searchParams.get('dateFrom')! + 'T00:00:00')
    : undefined;
  const currentDateTo = searchParams.get('dateTo')
    ? new Date(searchParams.get('dateTo')! + 'T00:00:00')
    : undefined;

  // ── Handlers ────────────────────────────────────────────────────────────

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

  function handleProductToggle(productId: string, checked: boolean) {
    const next = checked
      ? [...currentProductIds, productId]
      : currentProductIds.filter((id) => id !== productId);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('productIds');
    params.delete('page');
    next.forEach((id) => params.append('productIds', id));
    router.push(`?${params.toString()}`);
  }

  function handleHideFreeChange(checked: boolean) {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set('hideFree', 'true');
    } else {
      params.delete('hideFree');
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  }

  function handleClearFilters() {
    setClientSearch('');
    router.push('?');
  }

  // ── Derived state ────────────────────────────────────────────────────────

  const productsTriggerLabel = useMemo(() => {
    if (currentProductIds.length === 0) return 'Todos los productos';
    if (currentProductIds.length === 1) {
      return (
        products.find((p) => p.id === currentProductIds[0])?.name ??
        '1 producto'
      );
    }
    return `${currentProductIds.length} productos`;
  }, [currentProductIds, products]);

  const hasFilters =
    currentStatus ||
    currentPaymentStatus ||
    currentProductIds.length > 0 ||
    searchParams.get('dateFrom') ||
    searchParams.get('dateTo') ||
    clientSearch ||
    currentHideFree;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      {/* Order status */}
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs text-muted-foreground">Estado</label>
        <Select
          value={currentStatus || ALL_VALUE}
          onValueChange={(val) =>
            updateParam('status', val === ALL_VALUE ? null : val)
          }
        >
          <SelectTrigger className="h-9 w-full sm:min-w-[150px]">
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
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs text-muted-foreground">Estado de pago</label>
        <Select
          value={currentPaymentStatus || ALL_VALUE}
          onValueChange={(val) =>
            updateParam('paymentStatus', val === ALL_VALUE ? null : val)
          }
        >
          <SelectTrigger className="h-9 w-full sm:min-w-[170px]">
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

      {/* Multi-select product filter */}
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs text-muted-foreground">Producto</label>
        <Popover open={productPopoverOpen} onOpenChange={setProductPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'h-9 w-full sm:min-w-[180px] justify-between font-normal text-sm',
                currentProductIds.length === 0 && 'text-muted-foreground'
              )}
            >
              <span className="truncate">{productsTriggerLabel}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-2" align="start">
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2 py-1.5">
                Sin productos
              </p>
            ) : (
              <div className="max-h-[220px] overflow-y-auto space-y-0.5">
                {products.map((p) => {
                  const isChecked = currentProductIds.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-sm hover:bg-muted cursor-pointer text-sm select-none"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleProductToggle(p.id, !!checked)
                        }
                      />
                      <span className="truncate flex-1">{p.name}</span>
                      {isChecked && (
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                    </label>
                  );
                })}
              </div>
            )}
            {/* Quick-clear inside popover */}
            {currentProductIds.length > 0 && (
              <div className="border-t mt-1 pt-1">
                <button
                  type="button"
                  className="w-full text-left px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-sm transition-colors"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('productIds');
                    params.delete('page');
                    router.push(`?${params.toString()}`);
                    setProductPopoverOpen(false);
                  }}
                >
                  Limpiar selección
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Date range */}
      <DateRangePicker
        from={currentDateFrom}
        to={currentDateTo}
        onChange={handleDateChange}
        className="w-full sm:w-auto"
      />

      {/* Client search */}
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs text-muted-foreground">Buscar cliente</label>
        <Input
          type="text"
          placeholder="Nombre o email..."
          value={clientSearch}
          onChange={(e) => setClientSearch(e.target.value)}
          className="h-9 w-full sm:min-w-[200px]"
        />
      </div>

      {/* Hide free toggle */}
      <div className="flex items-center gap-2 w-full sm:w-auto sm:self-end h-9">
        <Switch
          id="hide-free"
          checked={currentHideFree}
          onCheckedChange={handleHideFreeChange}
        />
        <label
          htmlFor="hide-free"
          className="text-sm text-muted-foreground cursor-pointer whitespace-nowrap"
        >
          Ocultar gratuitos
        </label>
      </div>

      {/* Clear all filters */}
      {hasFilters && (
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="h-9 w-full sm:w-auto sm:self-end"
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
