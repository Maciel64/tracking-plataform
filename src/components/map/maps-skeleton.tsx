import { Skeleton } from "../ui/skeleton";

export function MapsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="rounded">
          <Skeleton className="h-64"></Skeleton>
          <Skeleton className="h-6 rounded mb-2"></Skeleton>
          <Skeleton className="h-4 rounded mb-2"></Skeleton>
          <Skeleton className="h-4 rounded mb-2"></Skeleton>
        </Skeleton>
      ))}
    </div>
  );
}
