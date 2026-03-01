'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Button } from '@soybelumont/ui/components/button';
import { Card } from '@soybelumont/ui/components/card';
import { Label } from '@soybelumont/ui/components/label';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ImageDropZoneProps {
  /** Label displayed above the drop zone */
  label: string;
  /** Preview URL (object URL for new files, remote URL for existing) */
  preview: string | null;
  /** Called when a file is selected or dropped */
  onChange: (file: File | null) => void;
  /** Called when the user clears the current image */
  onClear: () => void;
  /** CSS aspect-ratio value, e.g. "16/25" for cover, "4/3" for thumbnail */
  aspectRatio?: string;
  /** Validation error (i18n key) */
  error?: string | null;
  /** Whether image is being compressed */
  isCompressing?: boolean;
  /** Original file size in bytes */
  originalSize?: number | null;
  /** Compressed file size in bytes */
  compressedSize?: number | null;
  /** File name to display */
  fileName?: string | null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageDropZone({
  label,
  preview,
  onChange,
  onClear,
  aspectRatio = '1/1',
  error,
  isCompressing = false,
  originalSize,
  compressedSize,
  fileName,
}: ImageDropZoneProps) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    // Reset input so re-selecting the same file triggers onChange
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onChange(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if leaving the container (not entering a child)
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = '';
    onClear();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Card
        className={`
          relative overflow-hidden border-2 border-dashed transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/30'}
          ${error ? 'border-destructive' : ''}
        `}
        onClick={() => !preview && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="relative w-full" style={{ aspectRatio }}>
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover rounded-md"
            />
            {/* Compression overlay */}
            {isCompressing && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-md">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('PRODUCTS.IMAGE_COMPRESSING')}
                </div>
              </div>
            )}
            {/* Actions overlay */}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                <Upload className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-muted-foreground"
            style={{ aspectRatio }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">
                {t('PRODUCTS.IMAGE_DROP_HERE')}
              </p>
              <p className="text-xs">{t('PRODUCTS.IMAGE_FORMATS_HINT')}</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              {t('PRODUCTS.PICKER_SELECT_IMAGE')}
            </Button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </Card>

      {/* File info bar */}
      {fileName && !error && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span className="truncate max-w-[60%]">{fileName}</span>
          {originalSize && compressedSize ? (
            <span>
              {formatBytes(originalSize)} → {formatBytes(compressedSize)}
            </span>
          ) : originalSize ? (
            <span>{formatBytes(originalSize)}</span>
          ) : null}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive px-1">
          {t(error as Parameters<typeof t>[0])}
        </p>
      )}
    </div>
  );
}
