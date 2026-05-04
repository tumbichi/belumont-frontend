'use client';

import React, { useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import { formatPrice } from '@core/utils/formatters/formatPrice';
import { Button } from '@soybelumont/ui/components/button';
import { Badge } from '@soybelumont/ui/components/badge';
import { Input } from '@soybelumont/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@soybelumont/ui/components/select';
import { Switch } from '@soybelumont/ui/components/switch';
import { BookImageIcon, Loader2 } from 'lucide-react';
import {
  PatisserieProduct,
  PatisserieMetadata,
} from '@modules/patisserie/types/patisserie.types';
import { updatePatisserieProduct } from '@modules/patisserie/actions/updatePatisserieProduct';
import { togglePatisserieProductActive } from '@modules/patisserie/actions/togglePatisserieProductActive';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { sonner } from '@soybelumont/ui/components/sonner';

interface PatisserieTableProps {
  products: PatisserieProduct[];
}

type StockStatus = PatisserieProduct['stock_status'];

const stockStatusVariant: Record<
  StockStatus,
  'active' | 'inactive' | 'secondary'
> = {
  available: 'active',
  out_of_stock: 'inactive',
  on_request: 'secondary',
};

function PatisserieTable({ products }: PatisserieTableProps) {
  const t = useTranslations();
  const router = useRouter();

  const [localProducts, setLocalProducts] =
    useState<PatisserieProduct[]>(products);
  const [savingStockStatus, setSavingStockStatus] = useState<
    Record<string, boolean>
  >({});
  const [savingActive, setSavingActive] = useState<Record<string, boolean>>({});
  const [savingDias, setSavingDias] = useState<Record<string, boolean>>({});

  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );

  const isEmpty = localProducts.length === 0;

  const goToDetails = (product: PatisserieProduct) => {
    router.push(`/pasteleria/${product.id}`);
  };

  // ── Stock Status ──────────────────────────────────────────────────────────
  const handleStockStatusChange = async (
    productId: string,
    newStatus: StockStatus
  ) => {
    const previous = localProducts.find((p) => p.id === productId);
    if (!previous) return;

    // Optimistic update
    setLocalProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock_status: newStatus } : p
      )
    );
    setSavingStockStatus((prev) => ({ ...prev, [productId]: true }));

    try {
      await updatePatisserieProduct(productId, { stock_status: newStatus });
    } catch {
      // Revert
      setLocalProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, stock_status: previous.stock_status } : p
        )
      );
      sonner.toast.error(t('PATISSERIE.PRODUCT_UPDATE_ERROR'));
    } finally {
      setSavingStockStatus((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // ── Días anticipación ─────────────────────────────────────────────────────
  const handleDiasChange = (productId: string, rawValue: string) => {
    const numValue = parseInt(rawValue, 10);
    const value = isNaN(numValue) ? 0 : Math.max(0, numValue);

    // Optimistic update on local state immediately for responsive UX
    setLocalProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const existingMeta = (p.metadata as PatisserieMetadata) ?? {};
        return {
          ...p,
          metadata: { ...existingMeta, dias_anticipacion: value },
        };
      })
    );

    // Clear existing debounce timer
    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }

    // Schedule debounced save
    debounceTimers.current[productId] = setTimeout(async () => {
      const product = localProducts.find((p) => p.id === productId);
      const previousMeta = (product?.metadata as PatisserieMetadata) ?? {};

      setSavingDias((prev) => ({ ...prev, [productId]: true }));
      try {
        await updatePatisserieProduct(productId, {
          metadata: { ...previousMeta, dias_anticipacion: value },
        });
      } catch {
        // Revert dias_anticipacion to previous
        setLocalProducts((prev) =>
          prev.map((p) => {
            if (p.id !== productId) return p;
            return { ...p, metadata: previousMeta };
          })
        );
        sonner.toast.error(t('PATISSERIE.PRODUCT_UPDATE_ERROR'));
      } finally {
        setSavingDias((prev) => ({ ...prev, [productId]: false }));
      }
    }, 600);
  };

  // ── Active toggle ─────────────────────────────────────────────────────────
  const handleActiveToggle = async (productId: string, newValue: boolean) => {
    const previous = localProducts.find((p) => p.id === productId);
    if (!previous) return;

    // Optimistic update
    setLocalProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active: newValue } : p))
    );
    setSavingActive((prev) => ({ ...prev, [productId]: true }));

    try {
      await togglePatisserieProductActive(productId, newValue);
    } catch {
      // Revert
      setLocalProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, active: previous.active } : p
        )
      );
      sonner.toast.error(t('PATISSERIE.PRODUCT_UPDATE_ERROR'));
    } finally {
      setSavingActive((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('PATISSERIE.NAME')}</TableHead>
          <TableHead>{t('PATISSERIE.CATEGORY')}</TableHead>
          <TableHead>{t('PATISSERIE.PRICE')}</TableHead>
          <TableHead>{t('PATISSERIE.STOCK_STATUS')}</TableHead>
          <TableHead>Días anticip.</TableHead>
          <TableHead>{t('PATISSERIE.STATUS')}</TableHead>
          <TableHead>{t('PATISSERIE.ACTIONS')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!isEmpty ? (
          localProducts.map((product) => {
            const meta = (product.metadata as PatisserieMetadata) ?? {};
            const diasValue = meta.dias_anticipacion ?? 0;

            return (
              <TableRow key={product.id}>
                {/* Name */}
                <TableCell className="font-medium">{product.name}</TableCell>

                {/* Category */}
                <TableCell>{product.category ?? '—'}</TableCell>

                {/* Price */}
                <TableCell>{formatPrice(product.price)}</TableCell>

                {/* Stock Status — inline Select */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      value={product.stock_status}
                      onValueChange={(val) =>
                        handleStockStatusChange(product.id, val as StockStatus)
                      }
                      disabled={savingStockStatus[product.id]}
                    >
                      <SelectTrigger className="h-auto w-auto border-0 p-0 shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:ml-1 [&>svg]:h-3 [&>svg]:w-3">
                        <Badge
                          variant={stockStatusVariant[product.stock_status]}
                          className="cursor-pointer select-none"
                        >
                          <SelectValue />
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">
                          {t('PATISSERIE.STOCK_STATUS_AVAILABLE')}
                        </SelectItem>
                        <SelectItem value="on_request">
                          {t('PATISSERIE.STOCK_STATUS_ON_REQUEST')}
                        </SelectItem>
                        <SelectItem value="out_of_stock">
                          {t('PATISSERIE.STOCK_STATUS_OUT_OF_STOCK')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {savingStockStatus[product.id] && (
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </TableCell>

                {/* Días anticipación */}
                <TableCell>
                  {product.stock_status === 'on_request' ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        className="h-7 w-20 text-xs"
                        defaultValue={diasValue}
                        onChange={(e) =>
                          handleDiasChange(product.id, e.target.value)
                        }
                        disabled={savingDias[product.id]}
                      />
                      {savingDias[product.id] && (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Active — Switch */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.active}
                      onCheckedChange={(val) =>
                        handleActiveToggle(product.id, val)
                      }
                      disabled={savingActive[product.id]}
                      aria-label={
                        product.active
                          ? t('PATISSERIE.ACTIVE')
                          : t('PATISSERIE.INACTIVE')
                      }
                    />
                    {savingActive[product.id] && (
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToDetails(product)}
                  >
                    <BookImageIcon />
                    {t('PATISSERIE.VIEW_DETAILS')}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-muted-foreground"
            >
              {t('PATISSERIE.NO_PRODUCTS')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default PatisserieTable;
