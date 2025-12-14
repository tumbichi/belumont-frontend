'use client';

import { ChangeEvent, useState } from 'react';
import { Button } from '@soybelumont/ui/components/button';
import { Card } from '@soybelumont/ui/components/card';
import { Label } from '@soybelumont/ui/components/label';
import { sonner } from '@soybelumont/ui/components/sonner';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ConfirmImageUpdateModal } from '../components/ConfirmImageUpdateModal';
import { FileWithPreview } from '../actions/updateProductImage';
import attempt from '@core/lib/promises/attempt';
import { uploadAndUpdateProductImage } from '../actions/uploadAndUpdateProductImage';
import useProductSelected from '../contexts/product-selected-context/useProductSelected';

type ModalState =
  | {
      isOpen: boolean;
      imageType: 'cover' | 'thumbnail';
      file: FileWithPreview | null;
      oldImageUrl: string | null;
    }
  | {
      isOpen: boolean;
      imageType: 'gallery';
      file: FileWithPreview | null;
      oldImageUrl: string | null;
      galleryIndex: number;
    };

export function ProductImageManager() {
  const t = useTranslations();
  const { product, updateProduct } = useProductSelected();

  const [imagesToUpload, setImagesToUpload] = useState<{
    cover: FileWithPreview | null;
    thumbnail: FileWithPreview | null;
    gallery_image_1: FileWithPreview | null;
    gallery_image_2: FileWithPreview | null;
    gallery_image_3: FileWithPreview | null;
  }>({
    cover: null,
    thumbnail: null,
    gallery_image_1: null,
    gallery_image_2: null,
    gallery_image_3: null,
  });

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    imageType: 'cover',
    file: null,
    oldImageUrl: null,
  });

  console.log('[ProductImageManager] product', product);

  const galleryImages = product.product_images || [];

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;

    if (files && files[0]) {
      const file: FileWithPreview = files[0];
      file.preview = URL.createObjectURL(files[0]);
      console.log('files[0]', file);

      setImagesToUpload((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleUploadImage = (
    imageType: 'cover' | 'thumbnail' | 'gallery',
    index?: number
  ) => {
    switch (imageType) {
      case 'cover': {
        if (!imagesToUpload.cover) {
          sonner.toast.error(t('PRODUCTS.COVER_IMAGE_NOT_SELECTED'));
          return;
        }
        setModalState({
          isOpen: true,
          imageType: 'cover',
          file: imagesToUpload.cover,
          oldImageUrl: product.image_url,
        });
        return;
      }
      case 'thumbnail': {
        if (!imagesToUpload.thumbnail) {
          sonner.toast.error(t('PRODUCTS.THUMBNAIL_IMAGE_NOT_SELECTED'));
          return;
        }
        setModalState({
          isOpen: true,
          imageType: 'thumbnail',
          file: imagesToUpload.thumbnail,
          oldImageUrl: product.thumbnail_url,
        });
        return;
      }
      case 'gallery': {
        if (index === undefined) {
          sonner.toast.error(t('PRODUCTS.GALLERY_INDEX_NOT_PROVIDED'));
          return;
        }

        if (
          !imagesToUpload[
            `gallery_image_${index + 1}` as keyof typeof imagesToUpload
          ]
        ) {
          sonner.toast.error(t('PRODUCTS.GALLERY_IMAGE_NOT_SELECTED'));
          return;
        }

        console.log(
          '[ProductImageManager] Open modal gallery images',
          galleryImages
        );

        console.log(
          '[ProductImageManager] Open modal gallery image index',
          index
        );

        console.log('[ProductImageManager] Old image', galleryImages[index]);

        setModalState({
          isOpen: true,
          imageType: 'gallery',
          file: imagesToUpload[
            `gallery_image_${index + 1}` as keyof typeof imagesToUpload
          ],
          oldImageUrl: galleryImages[index] ?? null,
          galleryIndex: index,
        });

        return;
      }
      default:
        break;
    }
  };

  const handleUploadImageConfirm = async () => {
    switch (modalState.imageType) {
      case 'cover': {
        if (!imagesToUpload.cover) {
          sonner.toast.error(t('PRODUCTS.COVER_IMAGE_NOT_SELECTED'));
          throw new Error(t('PRODUCTS.COVER_IMAGE_NOT_SELECTED'));
        }

        const { data: productUpdated, error: e } = await attempt(
          uploadAndUpdateProductImage({
            productId: product.id,
            imageType: 'cover',
            file: imagesToUpload.cover,
            oldImageUrl: product.image_url,
            productPathname: product.pathname,
            galleryIndex: undefined,
          })
        );

        if (e || !productUpdated) {
          console.log('Error updating cover image', e);
          const error =
            e instanceof Error ? e.message : 'Failed to update image';

          sonner.toast.error(error);
          throw error;
        }

        console.log('Product cover image updated', productUpdated);

        updateProduct({ image_url: productUpdated.image_url });

        setImagesToUpload((prev) => ({ ...prev, cover: null }));
        handleCloseModal();

        sonner.toast.success(t('PRODUCTS.COVER_IMAGE_UPDATED'));
        return;
      }
      case 'thumbnail': {
        if (!imagesToUpload.thumbnail) {
          sonner.toast.error(t('PRODUCTS.THUMBNAIL_IMAGE_NOT_SELECTED'));
          throw new Error(t('PRODUCTS.THUMBNAIL_IMAGE_NOT_SELECTED'));
        }

        const { data: productUpdated, error: e } = await attempt(
          uploadAndUpdateProductImage({
            productId: product.id,
            imageType: 'thumbnail',
            file: imagesToUpload.thumbnail,
            oldImageUrl: product.thumbnail_url,
            productPathname: product.pathname,
            galleryIndex: undefined,
          })
        );

        if (e || !productUpdated) {
          console.log('Error updating thumbnail image', e);
          const error =
            e instanceof Error ? e.message : 'Failed to update image';

          sonner.toast.error(error);
          throw error;
        }

        console.log('Product thumbnail image updated', productUpdated);

        updateProduct({ thumbnail_url: productUpdated.thumbnail_url });
        setImagesToUpload((prev) => ({ ...prev, thumbnail: null }));

        handleCloseModal();
        sonner.toast.success(t('PRODUCTS.THUMBNAIL_UPDATED_SUCCESS'));
        return;
      }
      case 'gallery': {
        if (modalState.galleryIndex === undefined) {
          sonner.toast.error(t('PRODUCTS.GALLERY_INDEX_NOT_PROVIDED'));
          throw new Error(t('PRODUCTS.GALLERY_INDEX_NOT_PROVIDED'));
        }

        const { data: productUpdated, error: e } = await attempt(
          uploadAndUpdateProductImage({
            productId: product.id,
            imageType: 'gallery',
            file: imagesToUpload[
              `gallery_image_${modalState.galleryIndex + 1}` as keyof typeof imagesToUpload
            ]!,
            oldImageUrl: galleryImages[modalState.galleryIndex] ?? '',
            productPathname: product.pathname,
            galleryIndex: modalState.galleryIndex,
          })
        );

        if (e || !productUpdated) {
          console.log('Error updating gallery image', e);
          const error =
            e instanceof Error ? e.message : 'Failed to update image';

          sonner.toast.error(error);
          throw error;
        }

        console.log('Product gallery image updated', productUpdated);

        updateProduct({ product_images: productUpdated.product_images });
        setImagesToUpload((prev) => ({
          ...prev,
          [`gallery_image_${modalState.galleryIndex! + 1}`]: null,
        }));

        handleCloseModal();
        sonner.toast.success(t('PRODUCTS.GALLERY_IMAGE_UPDATED_SUCCESS'));
        return;
      }
      default: {
        return;
      }
    }
    // sonner.toast.success('Image updated successfully');
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <Card className="p-6">
        <Label className="block mb-4 text-base font-semibold">
          {t('PRODUCTS.COVER_IMAGE')}
        </Label>
        <div className="space-y-4">
          <div className="relative flex justify-center rounded-lg">
            <Image
              src={
                imagesToUpload.cover?.preview ||
                `${product.image_url}` ||
                '/placeholder.svg'
              }
              alt="Cover image"
              width={360}
              height={562}
              className="object-cover aspect-[16/25]"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            name="cover"
            id="cover-upload"
          />
          <Button
            asChild
            variant="outline"
            className="w-full bg-transparent cursor-pointer"
          >
            <label htmlFor="cover-upload">
              <Upload />
              {t('PRODUCTS.UPLOAD_COVER_IMAGE')}
            </label>
          </Button>
          <Button
            className="w-full cursor-pointer"
            onClick={() => handleUploadImage('cover')}
          >
            {t('PRODUCTS.CHANGE_COVER')}
          </Button>
        </div>
      </Card>

      {/* Thumbnail */}
      <Card className="p-6">
        <Label className="block mb-4 text-base font-semibold">
          {t('PRODUCTS.THUMBNAIL')}
        </Label>
        <div className="space-y-4">
          <div className="relative max-w-xs overflow-hidden rounded-lg">
            <Image
              src={
                imagesToUpload.thumbnail?.preview ||
                product.thumbnail_url ||
                '/placeholder.svg'
              }
              alt="Thumbnail"
              width={400}
              height={300}
              className="object-cover w-full h-48 transition-opacity group-hover:opacity-100"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <input
            name="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="thumbnail-upload"
          />
          <Button
            asChild
            variant="outline"
            className="w-full bg-transparent cursor-pointer"
          >
            <label htmlFor="thumbnail-upload">
              <Upload />
              {t('PRODUCTS.UPLOAD_THUMBNAIL')}
            </label>
          </Button>
          <Button
            className="w-full cursor-pointer"
            onClick={() => handleUploadImage('thumbnail')}
          >
            {t('PRODUCTS.CHANGE_THUMBNAIL')}
          </Button>
        </div>
      </Card>

      {/* Gallery Images */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-semibold">
            {t('PRODUCTS.GALLERY_IMAGES')}
          </Label>
          <span className="text-sm text-muted-foreground">
            {galleryImages.length} / 3
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative rounded-lg aspect-square">
                <Image
                  src={
                    // Try to use the preview of an uploaded gallery image first (if any),
                    // otherwise fall back to the existing image URL or the placeholder.
                    imagesToUpload[
                      `gallery_image_${index + 1}` as keyof typeof imagesToUpload
                    ]?.preview ||
                    image ||
                    '/placeholder.svg'
                  }
                  alt={`Gallery image ${index + 1}`}
                  width={180}
                  height={250}
                  className="object-cover w-full rounded-lg"
                  style={{ aspectRatio: '18/25', objectFit: 'cover' }}
                />
              </div>
              <div className="absolute top-2 left-2">
                <p className="px-3 py-1 text-white rounded-lg bg-primary">
                  {index + 1}
                </p>
              </div>
              {/* <button
                onClick={() => removeGalleryImage(index)}
                className="absolute p-1 transition-opacity rounded opacity-0 top-2 right-2 bg-destructive text-destructive-foreground group-hover:opacity-100"
              >
                <X size={16} />
              </button> */}

              <input
                name={`gallery_image_${index + 1}`}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id={`gallery-image-${index + 1}-upload`}
              />
              <Button
                asChild
                variant="outline"
                className="absolute transition-opacity opacity-0 cursor-pointer bottom-6 left-2 right-2 group-hover:opacity-100"
              >
                <label htmlFor={`gallery-image-${index + 1}-upload`}>
                  <Upload />
                  {t('PRODUCTS.UPLOAD_NEW_IMAGE')} {index + 1}
                </label>
              </Button>

              {imagesToUpload[
                `gallery_image_${index + 1}` as keyof typeof imagesToUpload
              ] && (
                <Button
                  className="absolute cursor-pointer left-2 right-2 -bottom-4"
                  onClick={() => handleUploadImage('gallery', index)}
                >
                  {t('PRODUCTS.REPLACE_IMAGE')} {index + 1}
                </Button>
              )}
            </div>
          ))}

          {/* Add Gallery Slot */}
          {/* {galleryImages.length < 3 && (
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleGalleryUpload(e.target.files)
                }
                className="hidden"
                id="gallery-upload"
              />
              <Button
                asChild
                variant="outline"
                className="w-full h-full bg-transparent cursor-pointer aspect-square"
              >
                <label
                  htmlFor="gallery-upload"
                  className="flex items-center justify-center"
                >
                  + Add
                </label>
              </Button>
            </div>
          )} */}
        </div>
      </Card>

      <ConfirmImageUpdateModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        imageType={modalState.imageType || 'cover'}
        file={modalState.file}
        oldImage={
          modalState.imageType === 'cover'
            ? {
                url: product.image_url,
                name: t('PRODUCTS.COVER_IMAGE'),
                size: 0,
                type: 'n/a',
              }
            : modalState.imageType === 'thumbnail'
              ? {
                  url: product.thumbnail_url,
                  name: t('PRODUCTS.THUMBNAIL'),
                  size: 0,
                  type: 'n/a',
                }
              : modalState.imageType === 'gallery'
                ? {
                    url: modalState.oldImageUrl ?? '',
                    name: `${t('PRODUCTS.GALLERY_IMAGE')} ${modalState.galleryIndex}`,
                    size: 0,
                    type: 'n/a',
                  }
                : null
        }
        productId={product.id}
        productPathname={product.pathname}
        onConfirm={() => handleUploadImageConfirm()}
      />
    </div>
  );
}
