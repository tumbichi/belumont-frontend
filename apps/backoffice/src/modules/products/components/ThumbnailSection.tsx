'use client';

import { Switch } from '@soybelumont/ui/components/switch';
import { Label } from '@soybelumont/ui/components/label';
import { useTranslations } from 'next-intl';
import { ImageDropZone } from './ImageDropZone';
import { UseImageUploadReturn } from '../hooks/useImageUpload';

interface ThumbnailSectionProps {
  /** Whether to use the cover image as thumbnail */
  useCoverAsThumbnail: boolean;
  /** Toggle handler */
  onToggle: (value: boolean) => void;
  /** useImageUpload instance for custom thumbnail */
  upload: UseImageUploadReturn;
  /** Existing thumbnail URL (for EDIT mode) */
  existingUrl?: string | null;
}

export function ThumbnailSection({
  useCoverAsThumbnail,
  onToggle,
  upload,
  existingUrl,
}: ThumbnailSectionProps) {
  const t = useTranslations();

  const preview = upload.preview || (!useCoverAsThumbnail ? existingUrl : null) || null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          {t('PRODUCTS.THUMBNAIL')}
        </Label>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="thumbnail-toggle"
          checked={useCoverAsThumbnail}
          onCheckedChange={onToggle}
        />
        <Label
          htmlFor="thumbnail-toggle"
          className="text-sm font-normal cursor-pointer"
        >
          {t('PRODUCTS.USE_COVER_AS_THUMBNAIL')}
        </Label>
      </div>

      {!useCoverAsThumbnail && (
        <div className="max-w-sm">
          <ImageDropZone
            label={t('PRODUCTS.THUMBNAIL_CUSTOM')}
            preview={preview}
            onChange={upload.setFile}
            onClear={upload.clear}
            aspectRatio="4/3"
            error={upload.error}
            isCompressing={upload.isCompressing}
            originalSize={upload.originalSize}
            compressedSize={upload.compressedSize}
            fileName={upload.file?.name}
          />
        </div>
      )}
    </div>
  );
}
