'use client';

import { Button } from '@soybelumont/ui/components/button';
import { Input } from '@soybelumont/ui/components/input';
import { Textarea } from '@soybelumont/ui/components/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@soybelumont/ui/components/form';
import {
  RadioGroup,
  RadioGroupItem,
} from '@soybelumont/ui/components/radio-group';
import { Label } from '@soybelumont/ui/components/label';
import { UseFormReturn } from 'react-hook-form';
import { ProductDetailsInput } from '../schemas/createProduct.schema';
import { useTranslations } from 'next-intl';

interface ProductFormContentProps {
  form: UseFormReturn<ProductDetailsInput>;
  submitLabel?: string;
  hideSubmitButton?: boolean;
  onPathnameManualEdit?: () => void;
  showProductType?: boolean;
  disableProductType?: boolean;
}

export function ProductFormContent({
  form,
  submitLabel,
  hideSubmitButton,
  onPathnameManualEdit,
  showProductType = false,
  disableProductType = false,
}: ProductFormContentProps) {
  const t = useTranslations();
  const { isSubmitting, isValidating, isDirty } = form.formState;

  return (
    <div className="space-y-6">
      {/* Product Type Selector */}
      {showProductType && (
        <FormField
          control={form.control}
          name="product_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t('PRODUCTS.PRODUCT_TYPE')}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={disableProductType}
                  className="flex gap-3"
                >
                  <Label
                    htmlFor="type-single"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md border transition-colors cursor-pointer ${
                      field.value === 'single'
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border hover:border-primary/50'
                    } ${disableProductType ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <RadioGroupItem value="single" id="type-single" />
                    {t('PRODUCTS.PRODUCT_TYPE_SINGLE')}
                  </Label>
                  <Label
                    htmlFor="type-bundle"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md border transition-colors cursor-pointer ${
                      field.value === 'bundle'
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border hover:border-primary/50'
                    } ${disableProductType ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <RadioGroupItem value="bundle" id="type-bundle" />
                    {t('PRODUCTS.PRODUCT_TYPE_BUNDLE')}
                  </Label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Product Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('PRODUCTS.PRODUCT_NAME')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('PRODUCTS.PRODUCT_NAME_PLACEHOLDER')}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Price + Pathname */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('PRODUCTS.PRODUCT_PRICE')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t('PRODUCTS.PRODUCT_PRICE_PLACEHOLDER')}
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pathname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('PRODUCTS.PRODUCT_PATHNAME')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('PRODUCTS.PRODUCT_PATHNAME_PLACEHOLDER')}
                  {...field}
                  onChange={(e) => {
                    onPathnameManualEdit?.();
                    const value = e.target.value
                      .toLowerCase()
                      .replace(/[^\w-]/g, '')
                      .replace(/^-+/, '');
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('PRODUCTS.PRODUCT_DESCRIPTION')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('PRODUCTS.PRODUCT_DESCRIPTION_PLACEHOLDER')}
                rows={5}
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
