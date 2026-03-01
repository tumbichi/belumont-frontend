'use client';

import { Button } from '@soybelumont/ui/components/button';
import { Input } from '@soybelumont/ui/components/input';
import { Label } from '@soybelumont/ui/components/label';
import { Textarea } from '@soybelumont/ui/components/textarea';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductDetailsInput } from '../schemas/createProduct.schema';
import { useTranslations } from 'next-intl';
import { Badge } from '@soybelumont/ui/components/badge';

interface ProductFormContentProps {
  register: UseFormRegister<ProductDetailsInput>;
  errors: FieldErrors<ProductDetailsInput>;
  isSubmitting: boolean;
  isValidating: boolean;
  isDirty: boolean;
  submitLabel?: string;
  hideSubmitButton?: boolean;
  watch?: UseFormWatch<ProductDetailsInput>;
  setValue?: UseFormSetValue<ProductDetailsInput>;
  onPathnameManualEdit?: () => void;
  showProductType?: boolean;
  disableProductType?: boolean;
}

export function ProductFormContent({
  register,
  errors,
  isSubmitting,
  isValidating,
  isDirty,
  submitLabel,
  hideSubmitButton,
  watch,
  setValue,
  onPathnameManualEdit,
  showProductType = false,
  disableProductType = false,
}: ProductFormContentProps) {
  const t = useTranslations();

  const currentProductType = watch ? watch('product_type') : 'single';

  const handlePathnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onPathnameManualEdit) {
      onPathnameManualEdit();
    }
    
    const value = e.target.value
      .toLowerCase()
      .replace(/[^\w-]/g, '')
      .replace(/^-+/, '');
    
    if (setValue) {
      setValue('pathname', value, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Type Selector */}
      {showProductType && (
        <div className="space-y-2">
          <Label>{t('PRODUCTS.PRODUCT_TYPE')}</Label>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={disableProductType}
              onClick={() => setValue?.('product_type', 'single', { shouldDirty: true })}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                currentProductType === 'single'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              } ${disableProductType ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Badge variant={currentProductType === 'single' ? 'default' : 'secondary'}>
                {t('PRODUCTS.PRODUCT_TYPE_SINGLE')}
              </Badge>
            </button>
            <button
              type="button"
              disabled={disableProductType}
              onClick={() => setValue?.('product_type', 'bundle', { shouldDirty: true })}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                currentProductType === 'bundle'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              } ${disableProductType ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Badge variant={currentProductType === 'bundle' ? 'default' : 'secondary'}>
                {t('PRODUCTS.PRODUCT_TYPE_BUNDLE')}
              </Badge>
            </button>
          </div>
          <input type="hidden" {...register('product_type')} />
        </div>
      )}

      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">{t('PRODUCTS.PRODUCT_NAME')}</Label>
        <Input
          id="name"
          placeholder={t('PRODUCTS.PRODUCT_NAME_PLACEHOLDER')}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
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
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        {/* Pathname */}
        <div className="space-y-2">
          <Label htmlFor="pathname">{t('PRODUCTS.PRODUCT_PATHNAME')}</Label>
          <Input
            id="pathname"
            placeholder={t('PRODUCTS.PRODUCT_PATHNAME_PLACEHOLDER')}
            {...register('pathname')}
            onChange={handlePathnameChange}
          />
          {errors.pathname && (
            <p className="text-sm text-destructive">{errors.pathname.message}</p>
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
          <p className="text-sm text-destructive">{errors.description.message}</p>
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
