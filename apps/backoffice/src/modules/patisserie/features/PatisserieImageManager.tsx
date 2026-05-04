'use client';

import { useState } from 'react';
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
import { ImageDropZone } from '@modules/products/components/ImageDropZone';
import { useImageUpload } from '@modules/products/hooks/useImageUpload';
import { updatePatisserieProductImage } from '@modules/patisserie/actions/uploadAndUpdatePatisserieImage';
import { usePatisserieSelected } from '../contexts/patisserie-selected-context';
import uploadImage from '@core/data/images-manager/services/uploadImage';
import attempt from '@core/lib/promises/attempt';

export function PatisserieImageManager() {
  const t = useTranslations();
  const { product, updateProduct } = usePatisserieSelected();

  // --- Cover ---
  const cover = useImageUpload();
  const [isSavingCover, setIsSavingCover] = useState(false);

  const handleSaveCover = async () => {
    if (!cover.compressedFile) return;
    setIsSavingCover(true);
    const imagePath = `pasteleria/${product.pathname.replaceAll('-', '_')}/cover_${Date.now()}`;
    const { data: imageUrl, error: uploadError } = await attempt(
      uploadImage(cover.compressedFile, imagePath, 'public-assets')
    );
    if (uploadError || !imageUrl) {
      setIsSavingCover(false);
      sonner.toast.error(t('PATISSERIE.IMAGE_UPDATE_ERROR'));
      return;
    }
    const { data: updated, error } = await attempt(
      updatePatisserieProductImage({
        productId: product.id,
        imageType: 'cover',
        newImageUrl: imageUrl,
      })
    );
    setIsSavingCover(false);
    if (error || !updated) {
      sonner.toast.error(t('PATISSERIE.IMAGE_UPDATE_ERROR'));
      return;
    }
    updateProduct({ image_url: updated.image_url });
    cover.clear();
    sonner.toast.success(t('PATISSERIE.COVER_IMAGE_UPDATED'));
  };

  // --- Thumbnail ---
  const thumbnail = useImageUpload();
  const [isSavingThumbnail, setIsSavingThumbnail] = useState(false);

  const handleSaveThumbnail = async () => {
    if (!thumbnail.compressedFile) return;
    setIsSavingThumbnail(true);
    const imagePath = `pasteleria/${product.pathname.replaceAll('-', '_')}/thumbnail_${Date.now()}`;
    const { data: imageUrl, error: uploadError } = await attempt(
      uploadImage(thumbnail.compressedFile, imagePath, 'public-assets')
    );
    if (uploadError || !imageUrl) {
      setIsSavingThumbnail(false);
      sonner.toast.error(t('PATISSERIE.IMAGE_UPDATE_ERROR'));
      return;
    }
    const { data: updated, error } = await attempt(
      updatePatisserieProductImage({
        productId: product.id,
        imageType: 'thumbnail',
        newImageUrl: imageUrl,
      })
    );
    setIsSavingThumbnail(false);
    if (error || !updated) {
      sonner.toast.error(t('PATISSERIE.IMAGE_UPDATE_ERROR'));
      return;
    }
    updateProduct({ thumbnail_url: updated.thumbnail_url });
    thumbnail.clear();
    sonner.toast.success(t('PATISSERIE.THUMBNAIL_UPDATED_SUCCESS'));
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('PATISSERIE.COVER_IMAGE')}</CardTitle>
          {cover.compressedFile && (
            <Button
              size="sm"
              onClick={handleSaveCover}
              disabled={isSavingCover || cover.isCompressing}
            >
              {isSavingCover && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {t('PATISSERIE.SAVE_CHANGES')}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <ImageDropZone
              label=""
              preview={cover.preview ?? product.image_url ?? null}
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
          <CardTitle>{t('PATISSERIE.THUMBNAIL')}</CardTitle>
          {thumbnail.compressedFile && (
            <Button
              size="sm"
              onClick={handleSaveThumbnail}
              disabled={isSavingThumbnail || thumbnail.isCompressing}
            >
              {isSavingThumbnail && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {t('PATISSERIE.SAVE_CHANGES')}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <ImageDropZone
              label=""
              preview={thumbnail.preview ?? product.thumbnail_url ?? null}
              onChange={thumbnail.setFile}
              onClear={thumbnail.clear}
              aspectRatio="1/1"
              error={thumbnail.error}
              isCompressing={thumbnail.isCompressing}
              originalSize={thumbnail.originalSize}
              compressedSize={thumbnail.compressedSize}
              fileName={thumbnail.file?.name}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
