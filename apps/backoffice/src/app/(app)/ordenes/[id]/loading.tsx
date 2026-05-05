import { Skeleton } from '@soybelumont/ui/components/skeleton';

export default function OrderDetailLoading() {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Back link + header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="space-y-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Status badge + id */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Section: Producto */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24 border-b pb-2" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>

      {/* Section: Cliente */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-20" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>

      {/* Section: Pago */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-16" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
