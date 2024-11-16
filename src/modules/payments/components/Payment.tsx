import Image from "next/image";
import React from "react";

import { Button } from "@core/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@core/components/ui/card";
import { Input } from "@core/components/ui/input";
import { Label } from "@core/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@core/components/ui/radio-group";
import { PaymentProvider } from "@core/data/supabase/payments/payments.repository";


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

export default function Payment() {
  return (
    <Card>
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
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" placeholder="Ej: Francis Mallmann" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="Ingresa el email donde queres recibir el producto" type="email" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Ir a pagar</Button>
      </CardFooter>
    </Card>
  );
}
