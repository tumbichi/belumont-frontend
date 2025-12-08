'use client';

import { ChangeEvent, useRef } from 'react';
import { Button } from '@soybelumont/ui/components/button';
import { Card } from '@soybelumont/ui/components/card';
import { Label } from '@soybelumont/ui/components/label';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ImagePickerProps {
  label: string;
  preview: string | null;
  onChange: (file: File | null) => void;
  onClear: () => void;
  error?: string;
}

export function ImagePicker({
  label,
  preview,
  onChange,
  onClear,
  error,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClear();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Card className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed hover:bg-accent/50 transition-colors min-h-[200px]">
        {preview ? (
          <div className="relative w-full h-full min-h-[200px]">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="w-8 h-8" />
            <span className="text-sm">Click to upload image</span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              Select Image
            </Button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </Card>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
