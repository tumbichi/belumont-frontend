'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface OrdersPaginationProps {
  page: number;
  total: number;
  pageSize?: number;
}

export function OrdersPagination({
  page,
  total,
  pageSize = 20,
}: OrdersPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="flex-1 sm:flex-none h-10 px-4 text-sm rounded-md border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px]"
        >
          Anterior
        </button>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="flex-1 sm:flex-none h-10 px-4 text-sm rounded-md border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px]"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
