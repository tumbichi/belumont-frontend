'use client';

import { useCallback } from 'react';
import { Button } from '@soybelumont/ui/components/button';
import { Label } from '@soybelumont/ui/components/label';
import { Plus, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ImageDropZone } from './ImageDropZone';
import { UseImageUploadReturn } from '../hooks/useImageUpload';

export interface GallerySlot {
  /** Existing remote URL (for EDIT mode), null for new uploads */
  existingUrl: string | null;
  /** useImageUpload instance for new file selection */
  upload: UseImageUploadReturn;
}

interface GalleryManagerProps {
  /** Array of gallery slots */
  slots: GallerySlot[];
  /** Max number of gallery images */
  max?: number;
  /** Called when user wants to add a new slot */
  onAdd: () => void;
  /** Called when user removes a slot at index */
  onRemove: (index: number) => void;
  /** Called when user swaps two slots */
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function GalleryManager({
  slots,
  max = 3,
  onAdd,
  onRemove,
  onReorder,
}: GalleryManagerProps) {
  const t = useTranslations();

  const moveUp = useCallback(
    (index: number) => {
      if (index > 0) onReorder(index, index - 1);
    },
    [onReorder]
  );

  const moveDown = useCallback(
    (index: number) => {
      if (index < slots.length - 1) onReorder(index, index + 1);
    },
    [onReorder, slots.length]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          {t('PRODUCTS.GALLERY_IMAGES')}
        </Label>
        <span className="text-sm text-muted-foreground">
          {slots.length} / {max}
        </span>
      </div>

      {slots.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
          {t('PRODUCTS.GALLERY_EMPTY')}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot, index) => {
          const preview = slot.upload.preview || slot.existingUrl;
          return (
            <div key={index} className="space-y-2">
              {/* Position indicator + reorder buttons */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {t('PRODUCTS.GALLERY_IMAGE')} {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    aria-label={`Move image ${index + 1} left`}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === slots.length - 1}
                    onClick={() => moveDown(index)}
                    aria-label={`Move image ${index + 1} right`}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onRemove(index)}
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <ImageDropZone
                label=""
                preview={preview}
                onChange={slot.upload.setFile}
                onClear={slot.upload.clear}
                aspectRatio="18/25"
                error={slot.upload.error}
                isCompressing={slot.upload.isCompressing}
                originalSize={slot.upload.originalSize}
                compressedSize={slot.upload.compressedSize}
                fileName={slot.upload.file?.name}
              />
            </div>
          );
        })}
      </div>

      {/* Add slot button */}
      {slots.length < max && (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('PRODUCTS.GALLERY_ADD_IMAGE')}
        </Button>
      )}
    </div>
  );
}
