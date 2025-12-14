'use client';

import { useState } from 'react';
import { Button } from '@soybelumont/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@soybelumont/ui/components/dialog';
import { Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Buyer {
  id: string;
  name: string;
  email: string;
}

interface EmailNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buyers: Buyer[];
  onConfirm: () => void;
}

const ITEMS_PER_PAGE = 5;

export function EmailNotificationDialog({
  open,
  onOpenChange,
  buyers,
  onConfirm,
}: EmailNotificationDialogProps) {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(buyers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBuyers = buyers.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
    setCurrentPage(1);
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentPage(1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {t('PRODUCTS.NOTIFY_PREVIOUS_BUYERS')}
          </DialogTitle>
          <DialogDescription>
            {t('PRODUCTS.NOTIFY_BUYERS_DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        {/* Buyer Count Summary */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <p className="text-sm font-medium">
            {t('PRODUCTS.TOTAL_USERS_TO_NOTIFY')}{' '}
            <span className="text-lg font-bold text-primary">
              {buyers.length}
            </span>
          </p>
        </div>

        {/* Buyers List */}
        {buyers.length > 0 ? (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="divide-y max-h-64 overflow-y-auto">
                {paginatedBuyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{buyer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {buyer.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {t('PRODUCTS.SHOWING')} {startIndex + 1}-{Math.min(endIndex, buyers.length)}{' '}
                  {t('PRODUCTS.OF')} {buyers.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2 px-3">
                    <span className="text-sm font-medium">
                      {currentPage} / {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('PRODUCTS.NO_BUYERS_TO_NOTIFY')}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('PRODUCTS.CANCEL')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={buyers.length === 0}
            className="gap-2"
          >
            <Mail className="w-4 h-4" />
            {t('PRODUCTS.SEND_TO')} {buyers.length} {buyers.length === 1 ? t('PRODUCTS.USER') : t('PRODUCTS.USERS')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
