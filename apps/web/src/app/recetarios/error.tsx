'use client';

import * as Sentry from '@sentry/nextjs';
import { Button } from '@soybelumont/ui/components/button';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => reset()}>
            Intentar de nuevo
          </Button>
          <Link href="/" prefetch={false}>
            <Button>Ir a inicio</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
