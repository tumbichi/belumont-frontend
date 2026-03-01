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
import { useProductSelected } from '../contexts/product-selected-context';
import { useTranslations } from 'next-intl';
import { sonner } from '@soybelumont/ui/components/sonner';

export function ProductHeader() {
  const t = useTranslations();
  const { product, toggleActive, isTogglingActive } = useProductSelected();

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
        sonner.toast.success(t('PRODUCTS.PRODUCT_UPDATED_SUCCESS'), {
          dismissible: true,
        });
      } catch (error) {
        console.error('[ProductHeader] Error toggling product active:', error);
        sonner.toast.error(t('PRODUCTS.PRODUCT_UPDATE_ERROR'), {
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
          <h1 className="text-2xl font-bold text-foreground">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={product.active ? 'active' : 'inactive'}>
              {product.active ? t('PRODUCTS.ACTIVE') : t('PRODUCTS.INACTIVE')}
            </Badge>
            {product.product_type === 'bundle' && (
              <Badge variant="bundle">
                {t('PRODUCTS.PRODUCT_TYPE_BUNDLE')}
              </Badge>
            )}
            <span
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {t('PRODUCTS.CREATED_AT')}{': '}
              {new Date(product.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <Switch
          checked={product.active}
          onCheckedChange={handleToggle}
          disabled={isTogglingActive}
          aria-label={product.active ? t('PRODUCTS.DEACTIVATE') : t('PRODUCTS.ACTIVATE')}
        />
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('PRODUCTS.STATUS')}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatus ? t('PRODUCTS.ACTIVATE_CONFIRM') : t('PRODUCTS.DEACTIVATE_CONFIRM')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isTogglingActive}>
              {t('COMMON.CANCEL')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isTogglingActive}>
              {isTogglingActive
                ? t('COMMON.LOADING')
                : pendingStatus
                  ? t('PRODUCTS.ACTIVATE')
                  : t('PRODUCTS.DEACTIVATE')}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
