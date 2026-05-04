'use client';

import { useState } from 'react';
import { Switch } from '@soybelumont/ui/components/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@soybelumont/ui/components/alert-dialog';
import { Badge } from '@soybelumont/ui/components/badge';
import { useTranslations } from 'next-intl';
import { sonner } from '@soybelumont/ui/components/sonner';
import { usePatisserieSelected } from '../contexts/patisserie-selected-context';

export function PatisserieHeader() {
  const t = useTranslations();
  const { product, toggleActive, isTogglingActive } = usePatisserieSelected();

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

  const handleToggle = () => {
    setPendingStatus(!product.active);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (pendingStatus !== null) {
      try {
        await toggleActive(pendingStatus);
        sonner.toast.success(t('PATISSERIE.PRODUCT_UPDATED_SUCCESS'), {
          dismissible: true,
        });
      } catch (error) {
        console.error('[PatisserieHeader] Error toggling active:', error);
        sonner.toast.error(t('PATISSERIE.PRODUCT_UPDATE_ERROR'), {
          dismissible: true,
        });
      }
    }
    setShowConfirm(false);
    setPendingStatus(null);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={product.active ? 'active' : 'inactive'}>
              {product.active
                ? t('PATISSERIE.ACTIVE')
                : t('PATISSERIE.INACTIVE')}
            </Badge>
            <Badge variant="secondary">
              {t(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                `PATISSERIE.STOCK_STATUS_${product.stock_status.toUpperCase()}` as any
              )}
            </Badge>
            <span
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {t('PATISSERIE.CREATED_AT')}:{' '}
              {new Date(product.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Switch
          checked={product.active}
          onCheckedChange={handleToggle}
          disabled={isTogglingActive}
          aria-label={
            product.active
              ? t('PATISSERIE.DEACTIVATE')
              : t('PATISSERIE.ACTIVATE')
          }
        />
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('PATISSERIE.STATUS')}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatus
                ? t('PATISSERIE.ACTIVATE_CONFIRM')
                : t('PATISSERIE.DEACTIVATE_CONFIRM')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isTogglingActive}>
              {t('COMMON.CANCEL')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isTogglingActive}
            >
              {isTogglingActive
                ? t('COMMON.LOADING')
                : pendingStatus
                  ? t('PATISSERIE.ACTIVATE')
                  : t('PATISSERIE.DEACTIVATE')}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
