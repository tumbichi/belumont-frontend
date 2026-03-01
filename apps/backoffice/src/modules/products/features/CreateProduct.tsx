'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Form } from '@soybelumont/ui/components/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@soybelumont/ui/components/card';
import { Button } from '@soybelumont/ui/components/button';
import { Progress } from '@soybelumont/ui/components/progress';
import { sonner } from '@soybelumont/ui/components/sonner';
import {
  productDetails,
  ProductDetailsInput,
} from '../schemas/createProduct.schema';
import { createProduct } from '../actions/createProduct';
import { createResource } from '../actions/createResource';
import { ProductFormContent } from '../components/ProductFormContent';
import { ImagePicker } from '../components/ImagePicker';
import { PdfPicker } from '../components/PdfPicker';
import uploadImage from '@core/data/images-manager/services/uploadImage';
import {
  createMultipartUpload,
  getSignedUrlForPart,
  completeMultipartUpload,
} from '../actions/multipart';
import attempt from '@core/lib/promises/attempt';
import { Info } from 'lucide-react';

/** Hook to manage File + its object-URL preview */
function useFilePreview() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const clear = useCallback(() => setFile(null), []);
  return { file, setFile, preview, clear };
}

async function uploadPdfToR2(file: File, fileName: string) {
  const contentType = file.type;

  const { data: createUploadResult, error: createError } = await attempt(
    createMultipartUpload(fileName, contentType)
  );
  if (createError || !createUploadResult)
    throw new Error('Error initiating upload');
  const { uploadId, filename } = createUploadResult;
  if (!uploadId || !filename) throw new Error('Failed to get upload ID');

  const chunkSize = 10 * 1024 * 1024; // 10 MB
  const totalChunks = Math.ceil(file.size / chunkSize);
  const uploadedParts: { ETag: string; PartNumber: number }[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    const partNumber = i + 1;

    const { data: signedUrl, error: signError } = await attempt(
      getSignedUrlForPart(filename, uploadId, partNumber)
    );
    if (signError || !signedUrl)
      throw new Error(`Failed to get signed URL for part ${partNumber}`);

    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: chunk,
    });
    if (!uploadResponse.ok)
      throw new Error(`Failed to upload part ${partNumber}`);

    const etag = uploadResponse.headers.get('ETag');
    if (!etag) throw new Error(`ETag not found for part ${partNumber}`);

    uploadedParts.push({
      ETag: etag.replace(/"/g, ''),
      PartNumber: partNumber,
    });
  }

  const { data: publicUrl, error: completeError } = await attempt(
    completeMultipartUpload(filename, uploadId, uploadedParts)
  );
  if (completeError || !publicUrl)
    throw new Error('Failed to complete multipart upload');

  return publicUrl;
}

export function CreateProduct() {
  const t = useTranslations();
  const router = useRouter();

  // File pickers
  const cover = useFilePreview();
  const gallery1 = useFilePreview();
  const gallery2 = useFilePreview();
  const gallery3 = useFilePreview();
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState('');

  const form = useForm<ProductDetailsInput>({
    resolver: zodResolver(productDetails),
    defaultValues: {
      name: '',
      price: 0,
      pathname: '',
      description: '',
      product_type: 'single',
    },
  });

  const nameValue = form.watch('name');
  const productType = form.watch('product_type');
  const [pathnameManuallyEdited, setPathnameManuallyEdited] = useState(false);
  const isBundle = productType === 'bundle';

  // Auto-generate pathname from name
  useEffect(() => {
    if (nameValue && !pathnameManuallyEdited) {
      const kebabCase = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('pathname', kebabCase, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [nameValue, pathnameManuallyEdited, form]);

  // Count total upload steps for progress
  const galleryFiles = useMemo(
    () => [gallery1.file, gallery2.file, gallery3.file].filter(Boolean),
    [gallery1.file, gallery2.file, gallery3.file]
  );

  const totalSteps = useMemo(() => {
    let steps = 1; // cover image always
    if (pdfFile) steps += 1;
    steps += galleryFiles.length;
    steps += 1; // create product
    return steps;
  }, [pdfFile, galleryFiles.length]);

  const handleCreateSubmit = async (data: ProductDetailsInput) => {
    if (!cover.file) {
      sonner.toast.error(t('PRODUCTS.COVER_IMAGE_REQUIRED'));
      return;
    }
    if (!isBundle && !pdfFile) {
      sonner.toast.error(t('PRODUCTS.PDF_REQUIRED'));
      return;
    }

    let currentStep = 0;
    const advance = (step: string) => {
      currentStep += 1;
      setUploadStep(step);
      setUploadProgress(Math.round((currentStep / totalSteps) * 100));
    };

    try {
      const imageFolderName = `products/${data.pathname.replaceAll('-', '_')}`;

      // 1. Cover image
      advance(t('PRODUCTS.UPLOAD_STEP_COVER'));
      const coverPath = `${imageFolderName}/cover_${Date.now()}`;
      const coverUrl = await uploadImage(
        cover.file,
        coverPath,
        'public-assets'
      );
      await createResource({
        folder: coverPath,
        url: coverUrl,
        provider: 'SUPABASE',
        bucket: 'public-assets',
      });

      // 2. PDF (R2) — only for single products
      let pdfUrl = '';
      if (pdfFile) {
        advance(t('PRODUCTS.UPLOAD_STEP_PDF'));
        pdfUrl = await uploadPdfToR2(pdfFile, pdfFile.name);
        await createResource({
          folder: '/',
          url: pdfUrl,
          provider: 'CLOUDFLARE_R2',
          bucket: 'R2',
        });
      }

      // 3. Gallery images
      const galleryUrls: string[] = [];
      const allGalleryFiles = [gallery1.file, gallery2.file, gallery3.file];

      for (let i = 0; i < allGalleryFiles.length; i++) {
        const file = allGalleryFiles[i];
        if (file) {
          advance(t('PRODUCTS.UPLOAD_STEP_GALLERY'));
          const path = `${imageFolderName}/gallery_image_${i + 1}_${Date.now()}`;
          const publicUrl = await uploadImage(file, path, 'public-assets');
          await createResource({
            folder: path,
            url: publicUrl,
            provider: 'SUPABASE',
            bucket: 'public-assets',
          });
          galleryUrls.push(publicUrl);
        }
      }

      // 4. Create product record
      advance(t('PRODUCTS.UPLOAD_STEP_SAVING'));
      await createProduct({
        ...data,
        description: data.description ?? null,
        image_url: coverUrl,
        thumbnail_url: coverUrl,
        download_url: pdfUrl || null,
        product_images: galleryUrls,
        product_type: data.product_type ?? 'single',
      });

      sonner.toast.success(t('PRODUCTS.PRODUCT_CREATED_SUCCESS'), {
        dismissible: true,
      });
      router.push('/productos');
    } catch (error) {
      sonner.toast.error(t('PRODUCTS.PRODUCT_CREATE_ERROR'), {
        dismissible: true,
        description:
          error instanceof Error ? error.message : JSON.stringify(error),
      });
    } finally {
      setUploadProgress(0);
      setUploadStep('');
    }
  };

  const isUploading = form.formState.isSubmitting && uploadProgress > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        {t('PRODUCTS.CREATE_PRODUCT_TITLE')}
      </h1>

      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(handleCreateSubmit)}
        >
          {/* Product Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('PRODUCTS.PRODUCT_INFO_TITLE')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductFormContent
                form={form}
                hideSubmitButton
                onPathnameManualEdit={() => setPathnameManuallyEdited(true)}
                showProductType
              />
            </CardContent>
          </Card>

          {/* Bundle info callout */}
          {isBundle && (
            <div className="flex items-start gap-3 p-4 rounded-md border bg-muted/50">
              <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t('PRODUCTS.BUNDLE_SELECT_PRODUCTS_DESCRIPTION')}
              </p>
            </div>
          )}

          {/* Cover Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('PRODUCTS.COVER_IMAGE')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ImagePicker
                  label={t('PRODUCTS.COVER_IMAGE')}
                  preview={cover.preview}
                  onChange={cover.setFile}
                  onClear={cover.clear}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gallery Images Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('PRODUCTS.GALLERY_IMAGES')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <ImagePicker
                  label={`${t('PRODUCTS.GALLERY_IMAGE')} 1`}
                  preview={gallery1.preview}
                  onChange={gallery1.setFile}
                  onClear={gallery1.clear}
                />
                <ImagePicker
                  label={`${t('PRODUCTS.GALLERY_IMAGE')} 2`}
                  preview={gallery2.preview}
                  onChange={gallery2.setFile}
                  onClear={gallery2.clear}
                />
                <ImagePicker
                  label={`${t('PRODUCTS.GALLERY_IMAGE')} 3`}
                  preview={gallery3.preview}
                  onChange={gallery3.setFile}
                  onClear={gallery3.clear}
                />
              </div>
            </CardContent>
          </Card>

          {/* PDF Card — single products only */}
          {!isBundle && (
            <Card>
              <CardHeader>
                <CardTitle>{t('PRODUCTS.PDF_TITLE')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <PdfPicker
                    label={t('PRODUCTS.PDF_TITLE')}
                    fileName={pdfFile ? pdfFile.name : null}
                    onChange={setPdfFile}
                    onClear={() => setPdfFile(null)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload progress */}
          {isUploading && (
            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{uploadStep}</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" loading={form.formState.isSubmitting}>
              {t('PRODUCTS.CREATE_PRODUCT_BUTTON')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
