'use client';

import { ChangeEvent, useRef } from 'react';
import { Button } from '@soybelumont/ui/components/button';
import { Card } from '@soybelumont/ui/components/card';
import { Label } from '@soybelumont/ui/components/label';
import { FileText, Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PdfPickerProps {
  label: string;
  fileName: string | null;
  onChange: (file: File | null) => void;
  onClear: () => void;
  error?: string;
}

export function PdfPicker({
  label,
  fileName,
  onChange,
  onClear,
  error,
}: PdfPickerProps) {
  const t = useTranslations();
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
      <Card className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed hover:bg-accent/50 transition-colors">
        {fileName ? (
          <div className="flex items-center gap-4 w-full">
            <div className="p-3 rounded-full bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground">{t('PRODUCTS.PICKER_PDF_DOCUMENT')}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground py-4">
            <Upload className="w-8 h-8" />
            <span className="text-sm">{t('PRODUCTS.PICKER_CLICK_PDF')}</span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              {t('PRODUCTS.PICKER_SELECT_PDF')}
            </Button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </Card>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
