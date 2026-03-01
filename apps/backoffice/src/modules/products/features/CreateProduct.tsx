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
import { ImageDropZone } from '../components/ImageDropZone';
import { GalleryManager, GallerySlot } from '../components/GalleryManager';
import { ThumbnailSection } from '../components/ThumbnailSection';
import { PdfPicker } from '../components/PdfPicker';
import { useImageUpload } from '../hooks/useImageUpload';
import uploadImage from '@core/data/images-manager/services/uploadImage';
import {
  createMultipartUpload,
  getSignedUrlForPart,
  completeMultipartUpload,
} from '../actions/multipart';
import attempt from '@core/lib/promises/attempt';
import { Info } from 'lucide-react';

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

  // Image uploads (with validation + compression)
  const cover = useImageUpload();
  const thumbnail = useImageUpload();
  const galleryUpload1 = useImageUpload();
  const galleryUpload2 = useImageUpload();
  const galleryUpload3 = useImageUpload();
  const allGalleryUploads = useMemo(
    () => [galleryUpload1, galleryUpload2, galleryUpload3],
    [galleryUpload1, galleryUpload2, galleryUpload3]
  );

  // Gallery management state
  const [gallerySlotCount, setGallerySlotCount] = useState(0);
  const gallerySlots: GallerySlot[] = useMemo(
    () =>
      allGalleryUploads.slice(0, gallerySlotCount).map((upload) => ({
        existingUrl: null,
        upload,
      })),
    [allGalleryUploads, gallerySlotCount]
  );

  const handleGalleryAdd = useCallback(() => {
    setGallerySlotCount((prev) => Math.min(prev + 1, 3));
  }, []);

  const handleGalleryRemove = useCallback(
    (index: number) => {
      // Shift uploads: move files from later slots into the removed slot
      for (let i = index; i < gallerySlotCount - 1; i++) {
        const nextFile = allGalleryUploads[i + 1]?.file;
        if (nextFile) {
          allGalleryUploads[i]!.setFile(nextFile);
        } else {
          allGalleryUploads[i]!.clear();
        }
      }
      allGalleryUploads[gallerySlotCount - 1]?.clear();
      setGallerySlotCount((prev) => Math.max(prev - 1, 0));
    },
    [allGalleryUploads, gallerySlotCount]
  );

  const handleGalleryReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const fromFile = allGalleryUploads[fromIndex]?.file;
      const toFile = allGalleryUploads[toIndex]?.file;
      // Swap files between slots
      if (fromFile) allGalleryUploads[toIndex]!.setFile(fromFile);
      else allGalleryUploads[toIndex]!.clear();
      if (toFile) allGalleryUploads[fromIndex]!.setFile(toFile);
      else allGalleryUploads[fromIndex]!.clear();
    },
    [allGalleryUploads]
  );

  // Thumbnail toggle
  const [useCoverAsThumbnail, setUseCoverAsThumbnail] = useState(true);

  // PDF
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
  const galleryFilesWithCompressed = useMemo(
    () =>
      allGalleryUploads
        .slice(0, gallerySlotCount)
        .map((u) => u.compressedFile)
        .filter(Boolean),
    [allGalleryUploads, gallerySlotCount]
  );

  const totalSteps = useMemo(() => {
    let steps = 1; // cover image always
    if (!useCoverAsThumbnail && thumbnail.compressedFile) steps += 1;
    if (pdfFile) steps += 1;
    steps += galleryFilesWithCompressed.length;
    steps += 1; // create product
    return steps;
  }, [pdfFile, galleryFilesWithCompressed.length, useCoverAsThumbnail, thumbnail.compressedFile]);

  const handleCreateSubmit = async (data: ProductDetailsInput) => {
    if (!cover.compressedFile) {
      sonner.toast.error(t('PRODUCTS.COVER_IMAGE_REQUIRED'));
      return;
    }
    if (!isBundle && !pdfFile) {
      sonner.toast.error(t('PRODUCTS.PDF_REQUIRED'));
      return;
    }

    // Check if any image is still compressing
    const anyCompressing =
      cover.isCompressing ||
      thumbnail.isCompressing ||
      allGalleryUploads.some((u) => u.isCompressing);
    if (anyCompressing) {
      sonner.toast.error(t('PRODUCTS.IMAGE_STILL_COMPRESSING'));
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

      // 1. Cover image (compressed)
      advance(t('PRODUCTS.UPLOAD_STEP_COVER'));
      const coverPath = `${imageFolderName}/cover_${Date.now()}`;
      const coverUrl = await uploadImage(
        cover.compressedFile,
        coverPath,
        'public-assets'
      );
      await createResource({
        folder: coverPath,
        url: coverUrl,
        provider: 'SUPABASE',
        bucket: 'public-assets',
      });

      // 2. Thumbnail (if custom)
      let thumbnailUrl = coverUrl;
      if (!useCoverAsThumbnail && thumbnail.compressedFile) {
        advance(t('PRODUCTS.UPLOAD_STEP_THUMBNAIL'));
        const thumbPath = `${imageFolderName}/thumbnail_${Date.now()}`;
        thumbnailUrl = await uploadImage(
          thumbnail.compressedFile,
          thumbPath,
          'public-assets'
        );
        await createResource({
          folder: thumbPath,
          url: thumbnailUrl,
          provider: 'SUPABASE',
          bucket: 'public-assets',
        });
      }

      // 3. PDF (R2) — only for single products
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

      // 4. Gallery images (compressed)
      const galleryUrls: string[] = [];
      for (let i = 0; i < gallerySlotCount; i++) {
        const compressed = allGalleryUploads[i]?.compressedFile;
        if (compressed) {
          advance(t('PRODUCTS.UPLOAD_STEP_GALLERY'));
          const path = `${imageFolderName}/gallery_image_${i + 1}_${Date.now()}`;
          const publicUrl = await uploadImage(compressed, path, 'public-assets');
          await createResource({
            folder: path,
            url: publicUrl,
            provider: 'SUPABASE',
            bucket: 'public-assets',
          });
          galleryUrls.push(publicUrl);
        }
      }

      // 5. Create product record
      advance(t('PRODUCTS.UPLOAD_STEP_SAVING'));
      await createProduct({
        ...data,
        description: data.description ?? null,
        image_url: coverUrl,
        thumbnail_url: thumbnailUrl,
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
              <div className="max-w-sm">
                <ImageDropZone
                  label={t('PRODUCTS.COVER_IMAGE')}
                  preview={cover.preview}
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

          {/* Thumbnail Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('PRODUCTS.THUMBNAIL')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ThumbnailSection
                useCoverAsThumbnail={useCoverAsThumbnail}
                onToggle={setUseCoverAsThumbnail}
                upload={thumbnail}
              />
            </CardContent>
          </Card>

          {/* Gallery Images Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('PRODUCTS.GALLERY_IMAGES')}</CardTitle>
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
