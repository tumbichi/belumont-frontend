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

interface Product {
  id: string;
  name: string;
  active: boolean;
  created_at: Date;
  [key: string]: any;
}

interface ProductHeaderProps {
  product: Product;
  onToggleActive?: (updates: Partial<Product>) => void;
}

export function ProductHeader({ product, onToggleActive }: ProductHeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

  const handleToggle = () => {
    setPendingStatus(!product.active);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (pendingStatus !== null) {
      onToggleActive && onToggleActive({ active: pendingStatus });
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
                  {product.active ? 'Active' : 'Inactive'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created:{' '}
                  {typeof window !== 'undefined'
                    ? new Date(product.created_at).toLocaleDateString()
                    : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                {product.active ? 'Active' : 'Inactive'}
              </span>
              <Switch checked={product.active} onCheckedChange={handleToggle} />
            </div>
          </div>
        </div>
      </header>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Product Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{' '}
              {pendingStatus ? 'activate' : 'deactivate'} this product? This
              will {pendingStatus ? 'make it visible' : 'hide it'} to customers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {pendingStatus ? 'Activate' : 'Deactivate'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
