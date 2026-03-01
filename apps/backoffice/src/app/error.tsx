'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@soybelumont/ui/components/button';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold">Algo salió mal</h2>
            <p className="text-sm text-gray-500">
              Ocurrió un error inesperado. Por favor, intentá de nuevo.
            </p>
            <Button onClick={reset}>Reintentar</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
