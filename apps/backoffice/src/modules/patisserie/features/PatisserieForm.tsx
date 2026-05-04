'use client';

import { Card, CardContent } from '@soybelumont/ui/components/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@soybelumont/ui/components/form';
import {
  patisserieDetails,
  PatisserieDetailsInput,
} from '@modules/patisserie/schemas/createPatisserie.schema';
import { updatePatisserieProduct } from '@modules/patisserie/actions/updatePatisserieProduct';
import { sonner } from '@soybelumont/ui/components/sonner';
import { useTranslations } from 'next-intl';
import { PatisserieFormContent } from '../components/PatisserieFormContent';
import { usePatisserieSelected } from '../contexts/patisserie-selected-context';
import { PatisserieMetadata } from '@modules/patisserie/types/patisserie.types';

export function PatisserieForm() {
  const t = useTranslations();
  const { product, updateProduct } = usePatisserieSelected();

  const metadata =
    product.metadata && typeof product.metadata === 'object'
      ? (product.metadata as PatisserieMetadata)
      : {};

  const form = useForm<PatisserieDetailsInput>({
    resolver: zodResolver(patisserieDetails),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      pathname: product.pathname,
      category: product.category ?? undefined,
      stock_status: product.stock_status,
      active: product.active,
      metadata: {
        porciones: metadata.porciones,
        alergenos: metadata.alergenos,
        dias_anticipacion: metadata.dias_anticipacion,
      },
    },
  });

  const handleSubmit = async (data: PatisserieDetailsInput) => {
    try {
      const updated = await updatePatisserieProduct(product.id, {
        ...data,
        category: data.category ?? null,
        metadata: data.metadata ?? null,
      });
      updateProduct(updated);
      form.reset({
        name: updated.name ?? product.name,
        description: updated.description ?? product.description,
        price: updated.price ?? product.price,
        pathname: updated.pathname ?? product.pathname,
        category: updated.category ?? undefined,
        stock_status: updated.stock_status ?? product.stock_status,
        active: updated.active ?? product.active,
        metadata: updated.metadata
          ? (updated.metadata as PatisserieMetadata)
          : {},
      });
      sonner.toast.success(t('PATISSERIE.PRODUCT_UPDATED_SUCCESS'), {
        dismissible: true,
      });
    } catch (error) {
      sonner.toast.error(t('PATISSERIE.PRODUCT_UPDATE_ERROR'), {
        dismissible: true,
        description:
          error instanceof Error ? error.message : JSON.stringify(error),
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <PatisserieFormContent form={form} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
