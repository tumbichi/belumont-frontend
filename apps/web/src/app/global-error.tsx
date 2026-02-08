'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
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
    <html>
      <body>
        <section className="flex flex-col items-center w-full py-12 text-center md:py-24">
          <div className="container flex flex-col items-center justify-center gap-2 pt-4 px-4 md:gap-4 lg:gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ups! Algo salió mal
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Ocurrió un error inesperado. Intentá de nuevo.
              </p>
            </div>
            <button
              onClick={() => reset()}
              className="inline-flex h-9 items-center rounded-md bg-black px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800"
            >
              Intentar de nuevo
            </button>
          </div>
        </section>
      </body>
    </html>
  );
}
