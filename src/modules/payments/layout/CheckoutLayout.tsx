'use client';
import { Toaster } from '@core/components/ui/toaster';
import { useToast } from '@core/hooks/use-toast';
import { useTranslations } from 'next-intl';
import React, { PropsWithChildren, useEffect } from 'react';

interface CheckoutLayoutProps extends PropsWithChildren {
  paymentStatus?: 'pending' | 'failure';
}

export default function CheckoutLayout({
  children,
  paymentStatus,
}: CheckoutLayoutProps) {
  const t = useTranslations();
  const { toast } = useToast();

  useEffect(
    function showToastWhenPaymentStatusExists() {
      switch (paymentStatus) {
        case 'pending': {
          toast({
            title: t('PAYMENT_PENDING.TITLE'),
            description: t('PAYMENT_PENDING.DESCRIPTION'),
            duration: 10000,
            className: 'bg-yellow-500 border-yellow-500',
          });
          break;
        }
        case 'failure': {
          toast({
            title: t('PAYMENT_FAILURE.TITLE'),
            description: t('PAYMENT_FAILURE.DESCRIPTION'),
            duration: 10000,
            variant: 'destructive',
          });
          break;
        }
      }
    },
    [paymentStatus, t, toast]
  );

  return (
    <>
      <div className="grid gap-6 px-4 py-8 md:grid-cols-2">{children}</div>;
      <Toaster />
    </>
  );
}
