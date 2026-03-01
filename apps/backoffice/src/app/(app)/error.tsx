'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@soybelumont/ui/components/button';
import {
  Card,
  CardContent,
} from '@soybelumont/ui/components/card';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Algo salió mal</h2>
            <p className="text-sm text-muted-foreground">
              Ocurrió un error inesperado. Por favor, intentá de nuevo.
            </p>
            {process.env.NODE_ENV === 'development' && error.message && (
              <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded mt-2 break-all">
                {error.message}
              </p>
            )}
          </div>
          <Button onClick={reset} variant="default" className="mt-2">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
