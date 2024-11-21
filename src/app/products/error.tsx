'use client';

import { Button } from '@core/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Error() {
  return (
    <section className="flex flex-col items-center w-full py-12 text-center  md:py-24">
      <Image
        src="/error.jpg"
        width="550"
        height="300"
        alt="Illustration"
        className="rounded-xl object-cover"
        style={{ aspectRatio: '550/300', objectFit: 'cover' }}
      />
      <div className="container flex flex-col items-center justify-center gap-2 pt-4 px-4 md:gap-4 lg:gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Ups! Pagina no encontrada
          </h1>
          <p className="text-gray-500  dark:text-gray-400">
            Parece que te has equivocado de camino.
          </p>
        </div>
        <Link href="/" prefetch={false}>
          <Button>Ir a inicio</Button>
        </Link>
      </div>
    </section>
  );
}
