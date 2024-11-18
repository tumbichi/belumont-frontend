"use client";

import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@core/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@core/components/ui/card";
import { Input } from "@core/components/ui/input";
import { Label } from "@core/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@core/components/ui/radio-group";
import { PaymentProvider } from "@core/data/supabase/payments/payments.repository";
import paymentSchema, { PaymentSchema } from "../schemas/payment.schema";
import axios from "axios";
import { Product } from "@core/data/supabase/products";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@core/components/ui/form";

interface RadioItem {
  label: string;
  value: PaymentProvider;
  icon: React.JSX.Element;
}

const paymentMethods: RadioItem[] = [
  {
    label: "Mercado Pago",
    value: "mercadopago",
    icon: <Image className="w-12 h-12 mb-3" src="/mercado_pago_logo.svg" alt="Mercado Pago" height={48} width={48} />,
  },
];

interface PaymentProps {
  product: Product;
  handlePayAction?: (data: PaymentSchema) => void;
}

export default function Payment({ product }: /* handlePayAction */ PaymentProps) {
  const form = useForm<PaymentSchema>({
    resolver: zodResolver(paymentSchema),
  });

  const handlePayAction = async (data: PaymentSchema) => {
    const response = await axios.post(`/api/payment`, {
      email: data.email,
      name: data.name,
      productId: product.id,
    });

    window.open(response.data.paymentUrl, "_blank");
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePayAction)}>
          <CardHeader>
            <CardTitle>Metodo de pago</CardTitle>
            <CardDescription>Ingresá tus datos de pago</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <RadioGroup defaultValue={paymentMethods[0].value} className="md:flex md:justify-center ">
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
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input {...field} id="email" placeholder="Ingresa el email donde queres recibir el producto" />
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
                    <FormLabel htmlFor="name">Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} id="name" placeholder="Ej: Francis Mallmann" />
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
              Redireccionar a MercadoPago
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

/* export default function Component() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12" />
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
} */
