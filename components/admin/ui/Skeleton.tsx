export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-blush-100 dark:bg-admin-surface ${className}`} />;
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-soft bg-white shadow-card dark:bg-admin-surface2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-t border-blush-100 p-3 first:border-t-0 dark:border-admin-border">
          <Skeleton className="h-12 w-10 shrink-0" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="ms-auto h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
