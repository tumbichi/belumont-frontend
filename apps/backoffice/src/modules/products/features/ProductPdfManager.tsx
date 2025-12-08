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
import { FileText, Upload } from 'lucide-react';
import { EmailNotificationDialog } from '../components/ProductEmailNotificationDialog';
import { useProductSelected } from '../contexts/product-selected-context';
import { FileWithPreview } from '../actions/updateProductImage';
import { sonner } from '@soybelumont/ui/components/sonner';
import { useTranslations } from 'next-intl';
import {
  createMultipartUpload,
  getSignedUrlForPart,
  completeMultipartUpload,
  abortMultipartUpload,
} from '../actions/multipart';
import { Progress } from '@soybelumont/ui/components/progress';
import attempt from '@core/lib/promises/attempt';
import updateProductPdf from '../actions/updateProductPdf';
import deleteFromR2 from '../actions/deletefromR2';

interface Buyer {
  id: string;
  name: string;
  email: string;
}

export function PdfManager() {
  const t = useTranslations();
  const { product, updateProduct: updateProductSelected } =
    useProductSelected();

  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [showEmailFlow, setShowEmailFlow] = useState(false);
  const [pendingPdfUrl, setPendingPdfUrl] = useState<FileWithPreview | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const getPdfFileName = (url?: string) => {
    try {
      return url?.split('/').pop() || 'document.pdf';
    } catch {
      return 'document.pdf';
    }
  };

  const handlePdfUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      (file as FileWithPreview).preview = url;
      setPendingPdfUrl(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdatePdf = () => {
    if (pendingPdfUrl) {
      setShowReplaceConfirm(true);
    } else {
      sonner.toast.info(t('PRODUCTS.SELECT_PDF_FIRST'));
    }
  };

  const handleConfirmReplace = async () => {
    if (!pendingPdfUrl) return;

    setIsUploading(true);
    setUploadProgress(0);
    setShowReplaceConfirm(false);

    const file = pendingPdfUrl;
    const fileName = file.name;
    const contentType = file.type;

    // 1. Create multipart upload
    const { data: createUploadResult, error } = await attempt(
      createMultipartUpload(fileName, contentType)
    );

    if (error || !createUploadResult) {
      sonner.toast.error(t('PRODUCTS.ERROR_INITIATING_UPLOAD'));
      setIsUploading(false);
      return;
    }

    const { uploadId, filename } = createUploadResult;

    if (!uploadId || !filename) {
      sonner.toast.error(t('PRODUCTS.FAILED_TO_GET_UPLOAD_ID'));
      setIsUploading(false);
      return;
    }

    // 2. Upload parts
    const chunkSize = 10 * 1024 * 1024; // 10MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadedParts: { ETag: string; PartNumber: number }[] = [];

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        const partNumber = i + 1;

        const { data: signedUrl, error } = await attempt(
          getSignedUrlForPart(filename, uploadId, partNumber)
        );

        if (error || !signedUrl) {
          throw new Error(`Failed to get signed URL for part ${partNumber}.`);
        }

        const uploadResponse = await fetch(signedUrl, {
          method: 'PUT',
          body: chunk,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload part ${partNumber}.`);
        }

        const etag = uploadResponse.headers.get('ETag');
        if (!etag) {
          throw new Error(`ETag not found in response for part ${partNumber}.`);
        }

        uploadedParts.push({
          ETag: etag.replace(/"/g, ''),
          PartNumber: partNumber,
        });
        setUploadProgress(((i + 1) / totalChunks) * 100);
      }

      // 3. Complete multipart upload
      const { data: publicUrl, error } = await attempt(
        completeMultipartUpload(filename, uploadId, uploadedParts)
      );

      if (error || !publicUrl) {
        throw new Error('Failed to complete multipart upload.');
      }

      const oldDownloadUrl = product.download_url;

      console.log('PDF uploaded successfully!');
      console.log('Public URL:', publicUrl);
      console.log('Old URL:', oldDownloadUrl);
      // console.log('Location:', completeResult.location);

      sonner.toast.success(t('PRODUCTS.FILE_UPLOADED_SUCCESS'));

      // TODO: Guardar completeResult.publicUrl en la base de datos
      // await updateProductPdfUrl(product.id, completeResult.publicUrl);

      // const productUpdated = await updateProduct(product.id, {
      //   download_url: publicUrl,
      // });
      const productUpdated = await updateProductPdf(product.id, {
        download_url: publicUrl,
        old_download_url: oldDownloadUrl,
      });
      updateProductSelected(productUpdated);

      const oldPdfFilename = oldDownloadUrl.split('/').pop() ?? '';
      await deleteFromR2(oldPdfFilename)
        .then(() => console.log('Old PDF deleted from R2'))
        .catch(() => console.warn('Failed to delete old PDF from R2'));

      setPendingPdfUrl(null);
      setShowEmailFlow(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred during upload.';
      sonner.toast.error(errorMessage);
      await abortMultipartUpload(filename, uploadId);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
          <div className="flex flex-col">
            <div className="flex justify-between space-y-2">
              <Label className="text-base font-semibold">
                {t('PRODUCTS.CURRENT_DOCUMENT')}
              </Label>
              <a
                href={product.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t('PRODUCTS.DOWNLOAD')}
              </a>
            </div>

            <div className="flex items-center w-full gap-3 p-3 mt-3 rounded-lg bg-muted">
              <FileText size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium">
                  {getPdfFileName(product.download_url)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.download_url}
                </p>
              </div>
            </div>
          </div>
          {pendingPdfUrl ? (
            <div className="flex flex-col ">
              <div className="flex justify-between space-y-2">
                <Label className="text-base font-semibold">
                  {t('PRODUCTS.PENDING_DOCUMENT')}
                </Label>
              </div>
              <div className="flex items-center w-full gap-3 p-3 mt-3 rounded-lg bg-muted">
                <FileText size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {getPdfFileName(pendingPdfUrl.name)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pendingPdfUrl.type} -{' '}
                    {(pendingPdfUrl.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Upload New PDF */}
          <div className="pt-4 space-y-3 border-t border-border">
            <Label className="text-base font-semibold">
              {t('PRODUCTS.UPDATE_DOCUMENT')}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t('PRODUCTS.UPDATE_DOCUMENT_DESCRIPTION')}
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
              variant="outline"
            >
              <label
                htmlFor="pdf-upload"
                className="flex items-center justify-center w-full gap-2"
              >
                <Upload size={16} />
                <span>{t('PRODUCTS.SELECT_NEW_PDF')}</span>
              </label>
            </Button>

            {isUploading && (
              <div className="space-y-2">
                <Label>{t('PRODUCTS.UPLOADING')}</Label>
                <Progress value={uploadProgress} />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            <Button
              className="w-full cursor-pointer"
              onClick={handleUpdatePdf}
              disabled={isUploading || !pendingPdfUrl}
            >
              {isUploading ? t('PRODUCTS.UPLOADING') : t('PRODUCTS.UPDATE_PDF')}
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
            <AlertDialogTitle>
              {t('PRODUCTS.REPLACE_PDF_DOCUMENT')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('PRODUCTS.REPLACE_PDF_DOCUMENT_DESCRIPTION')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel disabled={isUploading}>
              {t('PRODUCTS.CANCEL')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReplace}
              disabled={isUploading}
            >
              {isUploading ? t('PRODUCTS.UPLOADING') : t('PRODUCTS.REPLACE')}
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
