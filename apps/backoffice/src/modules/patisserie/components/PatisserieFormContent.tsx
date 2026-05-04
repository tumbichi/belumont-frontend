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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@soybelumont/ui/components/select';
import { Checkbox } from '@soybelumont/ui/components/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { PatisserieDetailsInput } from '@modules/patisserie/schemas/createPatisserie.schema';
import { useTranslations } from 'next-intl';

interface PatisserieFormContentProps {
  form: UseFormReturn<PatisserieDetailsInput>;
  submitLabel?: string;
  hideSubmitButton?: boolean;
  onPathnameManualEdit?: () => void;
}

export function PatisserieFormContent({
  form,
  submitLabel,
  hideSubmitButton,
  onPathnameManualEdit,
}: PatisserieFormContentProps) {
  const t = useTranslations();
  const { isSubmitting, isValidating, isDirty } = form.formState;

  return (
    <div className="space-y-6">
      {/* Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('PATISSERIE.PRODUCT_NAME')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('PATISSERIE.PRODUCT_NAME_PLACEHOLDER')}
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
              <FormLabel>{t('PATISSERIE.PRODUCT_PRICE')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t('PATISSERIE.PRODUCT_PRICE_PLACEHOLDER')}
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
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
              <FormLabel>{t('PATISSERIE.PRODUCT_PATHNAME')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('PATISSERIE.PRODUCT_PATHNAME_PLACEHOLDER')}
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
            <FormLabel>{t('PATISSERIE.PRODUCT_DESCRIPTION')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('PATISSERIE.PRODUCT_DESCRIPTION_PLACEHOLDER')}
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category + Stock Status */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('PATISSERIE.CATEGORY')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('PATISSERIE.CATEGORY_PLACEHOLDER')}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('PATISSERIE.STOCK_STATUS')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('PATISSERIE.STOCK_STATUS_PLACEHOLDER')}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">
                    {t('PATISSERIE.STOCK_STATUS_AVAILABLE')}
                  </SelectItem>
                  <SelectItem value="on_request">
                    {t('PATISSERIE.STOCK_STATUS_ON_REQUEST')}
                  </SelectItem>
                  <SelectItem value="out_of_stock">
                    {t('PATISSERIE.STOCK_STATUS_OUT_OF_STOCK')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Active */}
      <FormField
        control={form.control}
        name="active"
        render={({ field }) => (
          <FormItem className="flex items-center gap-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="cursor-pointer">
              {t('PATISSERIE.ACTIVE_LABEL')}
            </FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Metadata section */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {t('PATISSERIE.METADATA_TITLE')}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="metadata.porciones"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('PATISSERIE.METADATA_PORCIONES')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('PATISSERIE.METADATA_PORCIONES_PLACEHOLDER')}
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metadata.dias_anticipacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('PATISSERIE.METADATA_DIAS_ANTICIPACION')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder={t(
                      'PATISSERIE.METADATA_DIAS_ANTICIPACION_PLACEHOLDER'
                    )}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ''
                          ? undefined
                          : parseInt(e.target.value, 10)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="metadata.alergenos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('PATISSERIE.METADATA_ALERGENOS')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('PATISSERIE.METADATA_ALERGENOS_PLACEHOLDER')}
                  rows={2}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Submit */}
      {!hideSubmitButton && (
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={!isDirty}
            loading={isSubmitting || isValidating}
          >
            {submitLabel ?? t('PATISSERIE.SAVE_CHANGES')}
          </Button>
        </div>
      )}
    </div>
  );
}
