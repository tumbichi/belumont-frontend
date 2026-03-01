'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@soybelumont/ui/components/card';
import { Button } from '@soybelumont/ui/components/button';
import { sonner } from '@soybelumont/ui/components/sonner';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ImageDropZone } from '../components/ImageDropZone';
import { GalleryManager, GallerySlot } from '../components/GalleryManager';
import { ThumbnailSection } from '../components/ThumbnailSection';
import { useImageUpload } from '../hooks/useImageUpload';
import { uploadAndUpdateProductImage } from '../actions/uploadAndUpdateProductImage';
import useProductSelected from '../contexts/product-selected-context/useProductSelected';
import attempt from '@core/lib/promises/attempt';

export function ProductImageManager() {
  const t = useTranslations();
  const { product, updateProduct } = useProductSelected();

  // --- Cover ---
  const cover = useImageUpload();
  const [isSavingCover, setIsSavingCover] = useState(false);

  const handleSaveCover = async () => {
    if (!cover.compressedFile) return;
    setIsSavingCover(true);
    const { data: updated, error } = await attempt(
      uploadAndUpdateProductImage({
        productId: product.id,
        imageType: 'cover',
        file: cover.compressedFile,
        oldImageUrl: product.image_url,
        productPathname: product.pathname,
      })
    );
    setIsSavingCover(false);
    if (error || !updated) {
      sonner.toast.error(
        error instanceof Error
          ? error.message
          : t('PRODUCTS.IMAGE_UPDATE_ERROR')
      );
      return;
    }
    updateProduct({ image_url: updated.image_url });
    cover.clear();
    sonner.toast.success(t('PRODUCTS.COVER_IMAGE_UPDATED'));
  };

  // --- Thumbnail ---
  const thumbnailUpload = useImageUpload();
  const [isSavingThumbnail, setIsSavingThumbnail] = useState(false);

  const initialUseCoverAsThumbnail =
    !product.thumbnail_url || product.thumbnail_url === product.image_url;
  const [useCoverAsThumbnail, setUseCoverAsThumbnail] = useState(
    initialUseCoverAsThumbnail
  );

  const handleToggleThumbnail = useCallback(
    (value: boolean) => {
      setUseCoverAsThumbnail(value);
      if (value) {
        thumbnailUpload.clear();
      }
    },
    [thumbnailUpload]
  );

  const handleSaveThumbnail = async () => {
    if (useCoverAsThumbnail) {
      // Sync cover as thumbnail — fetch cover and re-upload as thumbnail
      const { data: updated, error } = await attempt(
        uploadAndUpdateProductImage({
          productId: product.id,
          imageType: 'thumbnail',
          file: await createFileFromUrl(product.image_url, 'cover-as-thumb'),
          oldImageUrl: product.thumbnail_url,
          productPathname: product.pathname,
        })
      );
      if (error || !updated) {
        sonner.toast.error(t('PRODUCTS.IMAGE_UPDATE_ERROR'));
        return;
      }
      updateProduct({ thumbnail_url: updated.thumbnail_url });
      sonner.toast.success(t('PRODUCTS.THUMBNAIL_UPDATED_SUCCESS'));
      return;
    }
    if (!thumbnailUpload.compressedFile) return;
    setIsSavingThumbnail(true);
    const { data: updated, error } = await attempt(
      uploadAndUpdateProductImage({
        productId: product.id,
        imageType: 'thumbnail',
        file: thumbnailUpload.compressedFile,
        oldImageUrl: product.thumbnail_url,
        productPathname: product.pathname,
      })
    );
    setIsSavingThumbnail(false);
    if (error || !updated) {
      sonner.toast.error(
        error instanceof Error
          ? error.message
          : t('PRODUCTS.IMAGE_UPDATE_ERROR')
      );
      return;
    }
    updateProduct({ thumbnail_url: updated.thumbnail_url });
    thumbnailUpload.clear();
    sonner.toast.success(t('PRODUCTS.THUMBNAIL_UPDATED_SUCCESS'));
  };

  const thumbnailHasChanges =
    useCoverAsThumbnail !== initialUseCoverAsThumbnail ||
    (!useCoverAsThumbnail && thumbnailUpload.compressedFile !== null);

  // --- Gallery ---
  const galleryUpload1 = useImageUpload();
  const galleryUpload2 = useImageUpload();
  const galleryUpload3 = useImageUpload();
  const allGalleryUploads = useMemo(
    () => [galleryUpload1, galleryUpload2, galleryUpload3],
    [galleryUpload1, galleryUpload2, galleryUpload3]
  );

  const existingGalleryImages = product.product_images || [];
  const [galleryUrls, setGalleryUrls] = useState<(string | null)[]>(() => [
    ...existingGalleryImages,
  ]);

  const gallerySlots: GallerySlot[] = useMemo(
    () =>
      galleryUrls.map((url, i) => ({
        existingUrl: url,
        upload: allGalleryUploads[i]!,
      })),
    [galleryUrls, allGalleryUploads]
  );

  const [isSavingGallery, setIsSavingGallery] = useState(false);

  const handleGalleryAdd = useCallback(() => {
    setGalleryUrls((prev) => {
      if (prev.length >= 3) return prev;
      return [...prev, null];
    });
  }, []);

  const handleGalleryRemove = useCallback(
    (index: number) => {
      const newUrls = [...galleryUrls];
      newUrls.splice(index, 1);
      setGalleryUrls(newUrls);

      // Shift upload states to fill the gap
      for (let i = index; i < allGalleryUploads.length - 1; i++) {
        const nextFile = allGalleryUploads[i + 1]?.file;
        if (nextFile) allGalleryUploads[i]!.setFile(nextFile);
        else allGalleryUploads[i]!.clear();
      }
      allGalleryUploads[allGalleryUploads.length - 1]?.clear();
    },
    [galleryUrls, allGalleryUploads]
  );

  const handleGalleryReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      setGalleryUrls((prev) => {
        const next = [...prev];
        [next[fromIndex], next[toIndex]] = [next[toIndex]!, next[fromIndex]!];
        return next;
      });
      const fromFile = allGalleryUploads[fromIndex]?.file;
      const toFile = allGalleryUploads[toIndex]?.file;
      if (fromFile) allGalleryUploads[toIndex]!.setFile(fromFile);
      else allGalleryUploads[toIndex]!.clear();
      if (toFile) allGalleryUploads[fromIndex]!.setFile(toFile);
      else allGalleryUploads[fromIndex]!.clear();
    },
    [allGalleryUploads]
  );

  const handleSaveGallery = async () => {
    setIsSavingGallery(true);
    try {
      for (let i = 0; i < galleryUrls.length; i++) {
        const upload = allGalleryUploads[i];
        if (upload?.compressedFile) {
          const { data: updated, error } = await attempt(
            uploadAndUpdateProductImage({
              productId: product.id,
              imageType: 'gallery',
              file: upload.compressedFile,
              oldImageUrl: existingGalleryImages[i] ?? '',
              productPathname: product.pathname,
              galleryIndex: i,
            })
          );
          if (error || !updated) {
            sonner.toast.error(
              error instanceof Error
                ? error.message
                : t('PRODUCTS.IMAGE_UPDATE_ERROR')
            );
            return;
          }
          updateProduct({ product_images: updated.product_images });
          upload.clear();
          setGalleryUrls((prev) => {
            const next = [...prev];
            next[i] = updated.product_images?.[i] ?? null;
            return next;
          });
        }
      }
      sonner.toast.success(t('PRODUCTS.GALLERY_IMAGE_UPDATED_SUCCESS'));
    } finally {
      setIsSavingGallery(false);
    }
  };

  const galleryHasChanges = allGalleryUploads
    .slice(0, galleryUrls.length)
    .some((u) => u.compressedFile !== null);

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('PRODUCTS.COVER_IMAGE')}</CardTitle>
          {cover.compressedFile && (
            <Button
              size="sm"
              onClick={handleSaveCover}
              disabled={isSavingCover || cover.isCompressing}
            >
              {isSavingCover && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {t('PRODUCTS.SAVE_CHANGES')}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <ImageDropZone
              label=""
              preview={cover.preview || product.image_url}
              onChange={cover.setFile}
              onClear={cover.clear}
              aspectRatio="16/25"
              error={cover.error}
              isCompressing={cover.isCompressing}
              originalSize={cover.originalSize}
              compressedSize={cover.compressedSize}
              fileName={cover.file?.name}
            />
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('PRODUCTS.THUMBNAIL')}</CardTitle>
          {thumbnailHasChanges && (
            <Button
              size="sm"
              onClick={handleSaveThumbnail}
              disabled={
                isSavingThumbnail ||
                thumbnailUpload.isCompressing ||
                (!useCoverAsThumbnail && !thumbnailUpload.compressedFile)
              }
            >
              {isSavingThumbnail && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {t('PRODUCTS.SAVE_CHANGES')}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <ThumbnailSection
            useCoverAsThumbnail={useCoverAsThumbnail}
            onToggle={handleToggleThumbnail}
            upload={thumbnailUpload}
            existingUrl={product.thumbnail_url}
          />
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('PRODUCTS.GALLERY_IMAGES')}</CardTitle>
          {galleryHasChanges && (
            <Button
              size="sm"
              onClick={handleSaveGallery}
              disabled={
                isSavingGallery ||
                allGalleryUploads.some((u) => u.isCompressing)
              }
            >
              {isSavingGallery && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {t('PRODUCTS.SAVE_CHANGES')}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <GalleryManager
            slots={gallerySlots}
            max={3}
            onAdd={handleGalleryAdd}
            onRemove={handleGalleryRemove}
            onReorder={handleGalleryReorder}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Helper: fetch a remote image URL and create a File object from it.
 * Used when syncing cover to thumbnail without a local file.
 */
async function createFileFromUrl(url: string, name: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], `${name}.webp`, { type: blob.type });
}
