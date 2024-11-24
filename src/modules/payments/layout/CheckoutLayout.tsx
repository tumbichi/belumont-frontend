'use client';
import { Toaster } from '@core/components/ui/toaster';
import { useToast } from '@core/hooks/use-toast';
import React, { PropsWithChildren, useEffect } from 'react';

interface CheckoutLayoutProps extends PropsWithChildren {
  paymentStatus?: 'pending' | 'failure';
}

export default function CheckoutLayout({
  children,
  paymentStatus,
}: CheckoutLayoutProps) {
  const { toast } = useToast();

  useEffect(
    function showToastWhenPaymentStatusExists() {
      switch (paymentStatus) {
        case 'pending': {
          toast({
            title: 'Pago pendiente',
            description:
              'Cuando el pago sea aprobado te enviaremos un correo con tu producto',
            duration: 10000,
            className: 'bg-yellow-500 border-yellow-500',
          });
          break;
        }
        case 'failure': {
          toast({
            title: 'Pago fallido',
            description:
              'El pago no fue aprobado, te recomendamos volver a intentarlo',
            duration: 10000,
            variant: 'destructive',
          });
          break;
        }
      }
    },
    [paymentStatus, toast]
  );

  return (
    <>
      <div className="grid gap-6 px-4 py-8 md:grid-cols-2">{children}</div>;
      <Toaster />
    </>
  );
}
