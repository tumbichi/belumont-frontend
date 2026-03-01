'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@soybelumont/ui/components/card';
import { Button } from '@soybelumont/ui/components/button';
import { Badge } from '@soybelumont/ui/components/badge';
import { Skeleton } from '@soybelumont/ui/components/skeleton';
import { sonner } from '@soybelumont/ui/components/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@soybelumont/ui/components/dialog';
import { Plus, Trash2, Check } from 'lucide-react';
import Image from 'next/image';
import { useProductSelected } from '../contexts/product-selected-context';
import { BundleItem, Product } from '@core/data/supabase/products';
import {
  getBundleItemsAction,
  getAvailableProductsAction,
  addBundleItemsAction,
  removeBundleItemAction,
} from '../actions/bundleItems';
import { formatPrice } from '@core/utils/formatters/formatPrice';
import attempt from '@core/lib/promises/attempt';

export function BundleItemsManager() {
  const t = useTranslations();
  const { product } = useProductSelected();
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [addingItems, setAddingItems] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const fetchBundleItems = async () => {
    setLoading(true);
    const { data, error } = await attempt(getBundleItemsAction(product.id));
    if (error) {
      console.error('Error fetching bundle items:', error);
    } else {
      setBundleItems(data ?? []);
    }
    setLoading(false);
  };

  const fetchAvailableProducts = async () => {
    const { data: allProducts, error } = await attempt(
      getAvailableProductsAction({ active: true })
    );
    if (error || !allProducts) return;

    const existingIds = new Set(bundleItems.map((item) => item.product_id));
    existingIds.add(product.id);
    const filtered = allProducts.filter(
      (p) => !existingIds.has(p.id) && p.product_type === 'single'
    );
    setAvailableProducts(filtered);
  };

  useEffect(() => {
    fetchBundleItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const handleOpenDialog = async () => {
    setSelectedProductIds([]);
    await fetchAvailableProducts();
    setDialogOpen(true);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddItems = async () => {
    if (selectedProductIds.length === 0) return;
    setAddingItems(true);
    const { error } = await attempt(
      addBundleItemsAction(product.id, selectedProductIds)
    );
    if (error) {
      sonner.toast.error(t('PRODUCTS.BUNDLE_ITEM_ADD_ERROR'));
    } else {
      sonner.toast.success(t('PRODUCTS.BUNDLE_ITEM_ADDED'));
      await fetchBundleItems();
    }
    setAddingItems(false);
    setDialogOpen(false);
  };

  const handleRemoveItem = async (bundleItemId: string) => {
    setRemovingItemId(bundleItemId);
    const { error } = await attempt(
      removeBundleItemAction(bundleItemId, product.id)
    );
    if (error) {
      sonner.toast.error(t('PRODUCTS.BUNDLE_ITEM_REMOVE_ERROR'));
    } else {
      sonner.toast.success(t('PRODUCTS.BUNDLE_ITEM_REMOVED'));
      setBundleItems((prev) => prev.filter((item) => item.id !== bundleItemId));
    }
    setRemovingItemId(null);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-8 h-4" />
              <Skeleton className="w-16 h-16 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {bundleItems.length} {t(bundleItems.length === 1 ? 'PRODUCTS.PRODUCT_SINGULAR' : 'PRODUCTS.PRODUCT_PLURAL')}
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleOpenDialog}>
              <Plus className="w-4 h-4 mr-1" />
              {t('PRODUCTS.ADD_BUNDLE_ITEMS')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {t('PRODUCTS.SELECT_PRODUCTS_FOR_BUNDLE')}
              </DialogTitle>
              <DialogDescription>
                {t('PRODUCTS.SELECT_PRODUCTS_FOR_BUNDLE_DESCRIPTION')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {availableProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t('PRODUCTS.NO_AVAILABLE_PRODUCTS')}
                </p>
              ) : (
                availableProducts.map((p) => {
                  const isSelected = selectedProductIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer hover:bg-accent transition-colors w-full text-left ${
                        isSelected ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => toggleProductSelection(p.id)}
                    >
                      <div
                        role="checkbox"
                        aria-checked={isSelected}
                        aria-label={p.name}
                        className={`flex items-center justify-center w-5 h-5 rounded border shrink-0 ${
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-input'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <Image
                        src={p.thumbnail_url}
                        width={48}
                        height={48}
                        alt={p.name}
                        className="rounded object-cover w-12 h-12"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(p.price)}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            {availableProducts.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {selectedProductIds.length} {t('PRODUCTS.SELECTED_COUNT')}
                </p>
                <Button
                  onClick={handleAddItems}
                  disabled={selectedProductIds.length === 0}
                  loading={addingItems}
                >
                  {t('PRODUCTS.ADD_BUNDLE_ITEMS')}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {bundleItems.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            {t('PRODUCTS.BUNDLE_ITEMS_EMPTY')}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {bundleItems.map((item, index) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground font-mono w-8 text-center">
                  #{index + 1}
                </div>
                <Image
                  src={item.product.thumbnail_url}
                  width={64}
                  height={64}
                  alt={item.product.name}
                  className="rounded object-cover w-16 h-16"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {formatPrice(item.product.price)}
                    </Badge>
                    <Badge
                      variant={item.product.active ? 'active' : 'inactive'}
                      className="text-xs"
                    >
                      {item.product.active
                        ? t('PRODUCTS.ACTIVE')
                        : t('PRODUCTS.INACTIVE')}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={removingItemId === item.id}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="ml-1">{t('PRODUCTS.REMOVE_BUNDLE_ITEM')}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
