'use client';

import React, { useState, useEffect } from 'react';
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
import { sonner } from '@soybelumont/ui/components/sonner';
import {
  patisserieDetails,
  PatisserieDetailsInput,
} from '@modules/patisserie/schemas/createPatisserie.schema';
import { createPatisserieProduct } from '@modules/patisserie/actions/createPatisserieProduct';
import { PatisserieFormContent } from '../components/PatisserieFormContent';

export function CreatePatisserie() {
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<PatisserieDetailsInput>({
    resolver: zodResolver(patisserieDetails),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      pathname: '',
      category: undefined,
      stock_status: 'on_request',
      active: true,
      metadata: {},
    },
  });

  const nameValue = form.watch('name');
  const [pathnameManuallyEdited, setPathnameManuallyEdited] = useState(false);

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

  const handleSubmit = async (data: PatisserieDetailsInput) => {
    try {
      await createPatisserieProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        pathname: data.pathname,
        active: data.active ?? true,
        stock_status: data.stock_status ?? 'on_request',
        category: data.category ?? null,
        metadata: data.metadata ?? null,
        image_url: null,
        thumbnail_url: null,
      });
      sonner.toast.success(t('PATISSERIE.PRODUCT_CREATED_SUCCESS'), {
        dismissible: true,
      });
      router.push('/pasteleria');
    } catch (error) {
      sonner.toast.error(t('PATISSERIE.PRODUCT_CREATE_ERROR'), {
        dismissible: true,
        description:
          error instanceof Error ? error.message : JSON.stringify(error),
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        {t('PATISSERIE.CREATE_PRODUCT_TITLE')}
      </h1>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{t('PATISSERIE.PRODUCT_INFO_TITLE')}</CardTitle>
            </CardHeader>
            <CardContent>
              <PatisserieFormContent
                form={form}
                hideSubmitButton
                onPathnameManualEdit={() => setPathnameManuallyEdited(true)}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              loading={form.formState.isSubmitting}
            >
              {t('PATISSERIE.CREATE_PRODUCT_BUTTON')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
