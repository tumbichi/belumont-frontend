'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@core/components/ui/card';
import { Input } from '@core/components/ui/input';
import { Label } from '@core/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@core/components/ui/radio-group';
import { PaymentProvider } from '@core/data/supabase/payments/payments.repository';
import paymentSchema, { PaymentSchema } from '../schemas/payment.schema';
import { Product } from '@core/data/supabase/products';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@core/components/ui/form';

interface RadioItem {
  label: string;
  value: PaymentProvider;
  icon: React.JSX.Element;
}

const paymentMethods: RadioItem[] = [
  {
    label: 'Mercado Pago',
    value: 'mercadopago',
    icon: (
      <Image
        className="w-12 h-12 mb-3"
        src="/mercado_pago_logo.svg"
        alt="Mercado Pago"
        height={48}
        width={48}
      />
    ),
  },
];

interface PaymentProps {
  product: Product;
  defaultValues?: Partial<PaymentSchema>;
}

export default function Payment({ product, defaultValues }: PaymentProps) {
  const t = useTranslations('PAYMENT');

  const form = useForm<PaymentSchema>({
    defaultValues: defaultValues,
    resolver: zodResolver(paymentSchema),
  });

  const handlePayAction = async (data: PaymentSchema) => {
    const response = await axios.post(`/api/payment`, {
      email: data.email,
      name: data.name,
      productId: product.id,
    });

    window.open(response.data.paymentUrl, '_self');
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePayAction)}>
          <CardHeader>
            <CardTitle>{t('TITLE')}</CardTitle>
            <CardDescription>{t('DESCRIPTION')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <RadioGroup
              defaultValue={paymentMethods[0].value}
              className="md:flex md:justify-center "
            >
              {paymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.label}>
                  <RadioGroupItem
                    value={paymentMethod.value}
                    id={paymentMethod.label}
                    className="sr-only peer"
                    aria-label="Card"
                  />
                  <Label
                    htmlFor="card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary min-w-56"
                  >
                    {paymentMethod.icon}
                    {paymentMethod.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">
                      {t('FORM.EMAIL.LABEL')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        placeholder={t('FORM.EMAIL.PLACEHOLDER')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">{t('FORM.NAME.LABEL')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="name"
                        placeholder={t('FORM.NAME.PLACEHOLDER')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
            >
              {t('FORM.SUBMIT')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
