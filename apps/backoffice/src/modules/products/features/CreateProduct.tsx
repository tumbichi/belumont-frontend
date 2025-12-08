'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card } from '@soybelumont/ui/components/card';
import { Button } from '@soybelumont/ui/components/button';
import { Separator } from '@soybelumont/ui/components/separator';
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

export function CreateProduct() {
  const t = useTranslations();
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const [galleryImage1, setGalleryImage1] = useState<File | null>(null);
  const [galleryImage1Preview, setGalleryImage1Preview] = useState<
    string | null
  >(null);

  const [galleryImage2, setGalleryImage2] = useState<File | null>(null);
  const [galleryImage2Preview, setGalleryImage2Preview] = useState<
    string | null
  >(null);

  const [galleryImage3, setGalleryImage3] = useState<File | null>(null);
  const [galleryImage3Preview, setGalleryImage3Preview] = useState<
    string | null
  >(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isValidating, isDirty, errors },
  } = useForm<ProductDetailsInput>({
    resolver: zodResolver(productDetails),
    defaultValues: {
      name: '',
      price: 0,
      pathname: '',
      description: '',
    },
  });

  const nameValue = watch('name');
  const [pathnameManuallyEdited, setPathnameManuallyEdited] = useState(false);

  // Auto-generate pathname from name (only if not manually edited)
  useEffect(() => {
    if (nameValue && !pathnameManuallyEdited) {
      const kebabCase = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('pathname', kebabCase, { shouldValidate: true, shouldDirty: true });
    }
  }, [nameValue, pathnameManuallyEdited, setValue]);

  // Cleanup preview URL on unmount or change
  useEffect(() => {
    if (!coverImage) {
      setCoverImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(coverImage);
    setCoverImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [coverImage]);

  useEffect(() => {
    if (!galleryImage1) {
      setGalleryImage1Preview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(galleryImage1);
    setGalleryImage1Preview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [galleryImage1]);

  useEffect(() => {
    if (!galleryImage2) {
      setGalleryImage2Preview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(galleryImage2);
    setGalleryImage2Preview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [galleryImage2]);

  useEffect(() => {
    if (!galleryImage3) {
      setGalleryImage3Preview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(galleryImage3);
    setGalleryImage3Preview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [galleryImage3]);

  const uploadPdfToR2 = async (file: File, fileName: string) => {
    const contentType = file.type;

    // 1. Create multipart upload
    const { data: createUploadResult, error: createError } = await attempt(
      createMultipartUpload(fileName, contentType)
    );

    if (createError || !createUploadResult)
      throw new Error('Error initiating upload');
    const { uploadId, filename } = createUploadResult;
    if (!uploadId || !filename) throw new Error('Failed to get upload ID');

    // 2. Upload parts
    const chunkSize = 10 * 1024 * 1024; // 10MB
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

    // 3. Complete multipart upload
    const { data: publicUrl, error: completeError } = await attempt(
      completeMultipartUpload(filename, uploadId, uploadedParts)
    );

    if (completeError || !publicUrl)
      throw new Error('Failed to complete multipart upload');

    return publicUrl;
  };

  const handleCreateSubmit = async (data: ProductDetailsInput) => {
    // Validate required files
    if (!coverImage) {
      sonner.toast.error(t('PRODUCTS.COVER_IMAGE_REQUIRED'));
      return;
    }
    if (!pdfFile) {
      sonner.toast.error(t('PRODUCTS.PDF_REQUIRED'));
      return;
    }

    try {
      const imageFolderName = `products/${data.pathname.replaceAll('-', '_')}`;
      // 1. Upload Cover Image (Supabase)
      const coverPath = `${imageFolderName}/cover_${Date.now()}`;
      const coverUrl = await uploadImage(
        coverImage,
        coverPath,
        'public-assets'
      );

      await createResource({
        folder: coverPath,
        url: coverUrl,
        provider: 'SUPABASE',
        bucket: 'public-assets',
      });

      // 2. Upload PDF (R2)
      //   const pdfFileName = `products/${data.pathname}/pdf_${Date.now()}.pdf`;
      const pdfUrl = await uploadPdfToR2(pdfFile, pdfFile.name);

      await createResource({
        folder: '/',
        url: pdfUrl,
        provider: 'CLOUDFLARE_R2',
        bucket: process.env.R2_BUCKET_NAME ?? 'R2',
      });

      // 3. Upload Gallery Images (Supabase)
      const galleryUrls: string[] = [];
      const galleryFiles = [galleryImage1, galleryImage2, galleryImage3];

      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        if (file) {
          const path = `${imageFolderName}/gallery_${i + 1}_${Date.now()}`;
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

      // 4. Create Product with all assets
      await createProduct({
        ...data,
        description: data.description ?? null,
        image_url: coverUrl,
        thumbnail_url: coverUrl,
        download_url: pdfUrl,
        product_images: galleryUrls,
      });

      sonner.toast.success(t('PRODUCTS.PRODUCT_CREATED_SUCCESS'), {
        dismissible: true,
      });

      router.push('/productos');
    } catch (error) {
      console.error('[CreateProduct] Error saving product:', error);
      sonner.toast.error(t('PRODUCTS.PRODUCT_CREATE_ERROR'), {
        dismissible: true,
        description: JSON.stringify(error),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('PRODUCTS.CREATE_PRODUCT_TITLE')}
          </h1>
        </div>

        <section>
          <Card className="p-6">
            <form
              className="space-y-6"
              onSubmit={handleSubmit(handleCreateSubmit)}
            >
              <ProductFormContent
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                isValidating={isValidating}
                isDirty={isDirty}
                hideSubmitButton={true}
                watch={watch}
                setValue={setValue}
                onPathnameManualEdit={() => setPathnameManuallyEdited(true)}
              />

              <div className="space-y-8">
                {/* Cover Image Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {t('PRODUCTS.COVER_IMAGE')}
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <ImagePicker
                      label={t('PRODUCTS.COVER_IMAGE')}
                      preview={coverImagePreview}
                      onChange={setCoverImage}
                      onClear={() => setCoverImage(null)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Gallery Images Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {t('PRODUCTS.GALLERY_IMAGES')}
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <ImagePicker
                      label={t('PRODUCTS.GALLERY_IMAGE') + ' 1'}
                      preview={galleryImage1Preview}
                      onChange={setGalleryImage1}
                      onClear={() => setGalleryImage1(null)}
                    />

                    <ImagePicker
                      label={t('PRODUCTS.GALLERY_IMAGE') + ' 2'}
                      preview={galleryImage2Preview}
                      onChange={setGalleryImage2}
                      onClear={() => setGalleryImage2(null)}
                    />

                    <ImagePicker
                      label={t('PRODUCTS.GALLERY_IMAGE') + ' 3'}
                      preview={galleryImage3Preview}
                      onChange={setGalleryImage3}
                      onClear={() => setGalleryImage3(null)}
                    />
                  </div>
                </div>

                <Separator />

                {/* PDF Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {t('PRODUCTS.PDF_TITLE')}
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <PdfPicker
                      label={t('PRODUCTS.PDF_TITLE')}
                      fileName={pdfFile ? pdfFile.name : null}
                      onChange={setPdfFile}
                      onClear={() => setPdfFile(null)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" loading={isSubmitting}>
                  {t('PRODUCTS.CREATE_PRODUCT_BUTTON')}
                </Button>
              </div>
            </form>
          </Card>
        </section>
      </main>
    </div>
  );
}
