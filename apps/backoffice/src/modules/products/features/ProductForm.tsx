'use client';

import { Button } from '@soybelumont/ui/components/button';
import { Card } from '@soybelumont/ui/components/card';
import { Input } from '@soybelumont/ui/components/input';
import { Label } from '@soybelumont/ui/components/label';
import { Textarea } from '@soybelumont/ui/components/textarea';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  productDetails,
  ProductDetailsInput,
} from '../schemas/createProduct.schema';
import { updateProduct } from '../actions/updateProduct';
import { useProductSelected } from '../contexts/product-selected-context';
import { sonner } from '@soybelumont/ui/components/sonner';
import { useTranslations } from 'next-intl';

export function ProductForm() {
  const t = useTranslations();
  const { product, updateProduct: updateProductSelected } =
    useProductSelected();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValidating, isDirty, errors },
    reset,
  } = useForm<ProductDetailsInput>({
    resolver: zodResolver(productDetails),
    defaultValues: {
      name: product.name,
      price: product.price,
      pathname: product.pathname,
      description: product.description,
    },
  });

  const handleSucessSubmit = async (data: ProductDetailsInput) => {
    console.log('[ProductForm] Submitted data:', data);
    try {
      const updatedProduct = await updateProduct(product.id, data);
      updateProductSelected(updatedProduct);
      reset({
        name: updatedProduct.name,
        price: updatedProduct.price,
        pathname: updatedProduct.pathname,
        description: updatedProduct.description,
      });
      sonner.toast.success(t('PRODUCTS.PRODUCT_UPDATED_SUCCESS'), {
        dismissible: true,
      });
    } catch (error) {
      console.error('[ProductForm] Error updating product:', error);
      sonner.toast.error(t('PRODUCTS.PRODUCT_UPDATE_ERROR'), {
        dismissible: true,
        description: JSON.stringify(error),
      });
    }
  };

  const handleError: SubmitErrorHandler<ProductDetailsInput> = (errors) => {
    console.error('Form errors:', errors);
  };

  return (
    <Card className="p-6">
      <form
        className="space-y-6"
        onSubmit={handleSubmit(handleSucessSubmit, handleError)}
      >
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">{t('PRODUCTS.PRODUCT_NAME')}</Label>
          <Input
            id="name"
            placeholder={t('PRODUCTS.PRODUCT_NAME_PLACEHOLDER')}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">{t('PRODUCTS.PRODUCT_PRICE')}</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder={t('PRODUCTS.PRODUCT_PRICE_PLACEHOLDER')}
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Pathname */}
          <div className="space-y-2">
            <Label htmlFor="pathname">{t('PRODUCTS.PRODUCT_PATHNAME')}</Label>
            <Input
              id="pathname"
              placeholder={t('PRODUCTS.PRODUCT_PATHNAME_PLACEHOLDER')}
              {...register('pathname')}
            />
            {errors.pathname && (
              <p className="text-sm text-red-500">{errors.pathname.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t('PRODUCTS.PRODUCT_DESCRIPTION')}</Label>
          <Textarea
            id="description"
            placeholder={t('PRODUCTS.PRODUCT_DESCRIPTION_PLACEHOLDER')}
            rows={5}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={!isDirty}
            loading={isSubmitting || isValidating}
          >
            {t('PRODUCTS.SAVE_CHANGES')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
