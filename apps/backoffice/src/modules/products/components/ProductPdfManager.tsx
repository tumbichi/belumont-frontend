'use client';

import { useState } from 'react';
import { Button } from '@soybelumont/ui/components/button';
import { Card } from '@soybelumont/ui/components/card';
import { Label } from '@soybelumont/ui/components/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@soybelumont/ui/components/alert-dialog';
import { FileText } from 'lucide-react';
import { EmailNotificationDialog } from './ProductEmailNotificationDialog';

interface Buyer {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  download_url: string;
  [key: string]: any;
}

interface PdfManagerProps {
  product: Product;
  onUpdate?: (updates: Partial<Product>) => void;
}

export function PdfManager({ product, onUpdate }: PdfManagerProps) {
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [showEmailFlow, setShowEmailFlow] = useState(false);
  const [pendingPdfUrl, setPendingPdfUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [mockBuyers] = useState<Buyer[]>([
    { id: '1', name: 'John Smith', email: 'john.smith@example.com' },
    { id: '2', name: 'Maria Garcia', email: 'maria.garcia@example.com' },
    { id: '3', name: 'Ahmed Hassan', email: 'ahmed.hassan@example.com' },
    { id: '4', name: 'Emma Wilson', email: 'emma.wilson@example.com' },
    { id: '5', name: 'Lisa Chen', email: 'lisa.chen@example.com' },
    {
      id: '6',
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@example.com',
    },
    { id: '7', name: 'Anna Mueller', email: 'anna.mueller@example.com' },
  ]);

  const getPdfFileName = (url: string) => {
    try {
      return url.split('/').pop() || 'document.pdf';
    } catch {
      return 'document.pdf';
    }
  };

  const handlePdfUpload = (file: File) => {
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setPendingPdfUrl(url);
      setShowReplaceConfirm(true);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmReplace = () => {
    if (pendingPdfUrl) {
      onUpdate && onUpdate({ download_url: pendingPdfUrl });
      setShowReplaceConfirm(false);
      setShowEmailFlow(true);
      setPendingPdfUrl(null);
    }
  };

  const handleSendEmails = () => {
    console.log('[v0] Sending emails to previous buyers about new PDF version');
    setShowEmailFlow(false);
  };

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          {/* Current PDF Status */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Current Document
              </Label>
              <div className="flex items-center gap-3 mt-3 p-3 bg-muted rounded-lg">
                <FileText size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-sm">
                    {getPdfFileName(product.download_url)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.download_url}
                  </p>
                </div>
              </div>
            </div>
            <a
              href={product.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm font-medium"
            >
              Download
            </a>
          </div>

          {/* Upload New PDF */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Label className="text-base font-semibold">Update Document</Label>
            <p className="text-sm text-muted-foreground">
              Upload a new PDF to replace the current version. Previous buyers
              will be notified.
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                e.target.files?.[0] && handlePdfUpload(e.target.files[0])
              }
              className="hidden"
              id="pdf-upload"
              disabled={isUploading}
            />
            <Button
              asChild
              className="w-full cursor-pointer"
              disabled={isUploading}
            >
              <label htmlFor="pdf-upload">
                {isUploading ? 'Uploading...' : 'Upload New PDF'}
              </label>
            </Button>
          </div>
        </div>
      </Card>

      {/* Replace Confirmation Dialog */}
      <AlertDialog
        open={showReplaceConfirm}
        onOpenChange={setShowReplaceConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace PDF Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to replace the current PDF? The new version
              will become available for download immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReplace}>
              Replace
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <EmailNotificationDialog
        open={showEmailFlow}
        onOpenChange={setShowEmailFlow}
        buyers={mockBuyers}
        onConfirm={handleSendEmails}
      />
    </>
  );
}
