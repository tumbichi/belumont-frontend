import { Skeleton } from '@soybelumont/ui/components/skeleton';

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-28" />

      <div className="rounded-lg border">
        <div className="border-b px-4 py-3 flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-b last:border-0 px-4 py-3 flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
