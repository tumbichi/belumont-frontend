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
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant={product.active ? 'default' : 'secondary'}>
                  {product.active ? t('PRODUCTS.ACTIVE') : t('PRODUCTS.INACTIVE')}
                </Badge>
                <span
                  className="text-sm text-muted-foreground"
                  suppressHydrationWarning
                >
                  Creado: {new Date(product.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                {product.active ? t('PRODUCTS.ACTIVE') : t('PRODUCTS.INACTIVE')}
              </span>
              <Switch
                checked={product.active}
                onCheckedChange={handleToggle}
                disabled={isTogglingActive}
              />
            </div>
          </div>
        </div>
      </header>

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
