'use client';

import { Button } from '@soybelumont/ui/components/button';
import { Input } from '@soybelumont/ui/components/input';
import { Label } from '@soybelumont/ui/components/label';
import { Textarea } from '@soybelumont/ui/components/textarea';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ProductDetailsInput } from '../schemas/createProduct.schema';
import { useTranslations } from 'next-intl';

interface ProductFormContentProps {
  register: UseFormRegister<ProductDetailsInput>;
  errors: FieldErrors<ProductDetailsInput>;
  isSubmitting: boolean;
  isValidating: boolean;
  isDirty: boolean;
  submitLabel?: string;
  hideSubmitButton?: boolean;
}

export function ProductFormContent({
  register,
  errors,
  isSubmitting,
  isValidating,
  isDirty,
  submitLabel,
  hideSubmitButton,
}: ProductFormContentProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
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
      {!hideSubmitButton && (
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={!isDirty}
            loading={isSubmitting || isValidating}
          >
            {submitLabel || t('PRODUCTS.SAVE_CHANGES')}
          </Button>
        </div>
      )}
    </div>
  );
}
