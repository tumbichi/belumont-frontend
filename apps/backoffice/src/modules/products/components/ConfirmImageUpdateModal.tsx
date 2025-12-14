'use client';

import { useState } from 'react';
import Image from 'next/image';
import { sonner } from '@soybelumont/ui/components/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@soybelumont/ui/components/dialog';
import { Button } from '@soybelumont/ui/components/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { FileWithPreview } from '../actions/updateProductImage';
import { useTranslations } from 'next-intl';

interface OldImageDetails {
  url: string;
  name: string;
  size: number; // in bytes
  type: string; // e.g., 'image/jpeg'
}

type ImageType = 'cover' | 'thumbnail' | 'gallery';

interface ConfirmImageUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageType: ImageType;
  file: FileWithPreview | null;
  oldImage?: OldImageDetails | null;
  productId: string;
  productPathname: string;
  galleryIndex?: number;
  onConfirm: () => Promise<void>;
}

const calculateDimensions = (
  imageType: ImageType
): { height: number; width: number } => {
  switch (imageType) {
    case 'cover': {
      return { height: 480, width: 750 };
    }
    case 'thumbnail': {
      return { height: 300, width: 400 };
    }
    default: {
      return { height: 300, width: 300 };
    }
  }
};

export function ConfirmImageUpdateModal({
  isOpen,
  imageType,
  file,
  oldImage,
  galleryIndex,
  onClose,
  onConfirm,
}: ConfirmImageUpdateModalProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { height, width } = calculateDimensions(imageType);

  const getImageLabel = () => {
    switch (imageType) {
      case 'cover':
        return t('PRODUCTS.COVER_IMAGE');
      case 'thumbnail':
        return t('PRODUCTS.THUMBNAIL');
      case 'gallery':
        return `${t('PRODUCTS.GALLERY_IMAGE')} ${(galleryIndex ?? 0) + 1}`;
      default:
        return 'Image';
    }
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setError(null);

    onConfirm()
      .catch((e) => {
        const errorMessage =
          e instanceof Error ? e.message : 'Unknown error occurred';
        setError(errorMessage);
        sonner.toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRetry = () => {
    setError(null);
    handleConfirm();
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('PRODUCTS.CONFIRM_IMAGE_UPDATE')} - {getImageLabel()}</DialogTitle>
          <DialogDescription>
            {t('PRODUCTS.REVIEW_CHANGES')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Old vs New Comparison */}
          <div className="flex gap-4">
            {oldImage && (
              <div className="flex flex-col w-[50%] flex-1 p-4 border rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('PRODUCTS.CURRENT_IMAGE')}
                  </p>
                  <div className="relative w-full overflow-hidden rounded-md bg-muted">
                    <Image
                      src={oldImage.url || '/placeholder.svg'}
                      alt="Current image"
                      width={width}
                      height={height}
                      className={`object-cover ${imageType === 'thumbnail' ? 'h-48' : ''}`}
                    />
                  </div>
                </div>
                <div className="pt-2 mt-auto space-y-1 text-xs text-muted-foreground">
                  <p>
                    <strong>{t('PRODUCTS.IMAGE_NAME')}:</strong> {oldImage.name}
                  </p>
                  <p>
                    <strong>{t('PRODUCTS.IMAGE_SIZE')}:</strong> {(oldImage.size / 1024).toFixed(2)}{' '}
                    KB
                  </p>
                  <p>
                    <strong>{t('PRODUCTS.IMAGE_TYPE')}:</strong> {oldImage.type}
                  </p>
                </div>
              </div>
            )}
            <div className="flex flex-col w-[50%] flex-1 p-4 border rounded-lg">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t('PRODUCTS.NEW_IMAGE')}
                </p>
                <div className="relative w-full overflow-hidden rounded-md bg-muted">
                  <Image
                    src={file?.preview || '/placeholder.svg'}
                    alt="New image"
                    width={width}
                    height={height}
                    className={`object-cover ${imageType === 'thumbnail' ? 'h-48' : ''}`}
                  />
                </div>
              </div>
              {file && (
                <div className="pt-2 mt-auto space-y-1 text-xs text-muted-foreground">
                  <p>
                    <strong>{t('PRODUCTS.IMAGE_NAME')}:</strong> {file.name}
                  </p>
                  <p>
                    <strong>{t('PRODUCTS.IMAGE_SIZE')}:</strong> {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <p>
                    <strong>{t('PRODUCTS.IMAGE_TYPE')}:</strong> {file.type}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="flex items-start gap-3 p-3 border rounded-lg bg-destructive/10 border-destructive/30">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">
                  {t('PRODUCTS.ERROR_UPDATING_IMAGE')}
                </p>
                <p className="mt-1 text-sm text-destructive/90">{error}</p>
              </div>
            </div>
          )}

          {/* Image Details */}
          <div className="p-3 space-y-1 text-sm rounded-lg bg-muted text-muted-foreground">
            <p>
              <strong>{t('PRODUCTS.IMAGE_TYPE')}:</strong> {getImageLabel()}
            </p>
            <p>
              <strong>{t('PRODUCTS.IMAGE_ACTION')}:</strong>{' '}
              {oldImage ? t('PRODUCTS.REPLACE_EXISTING_IMAGE') : t('PRODUCTS.UPLOAD_NEW_IMAGE_ACTION')}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t('PRODUCTS.CANCEL')}
          </Button>
          {error ? (
            <Button
              onClick={handleRetry}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('PRODUCTS.RETRY')}
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? t('PRODUCTS.UPDATING') : t('PRODUCTS.CONFIRM_UPDATE')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
