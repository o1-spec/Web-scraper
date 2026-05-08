export function SkeletonLoader({ count = 1, type = 'card' }: { count?: number; type?: 'card' | 'table-row' | 'text' }) {
  if (type === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (type === 'table-row') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="h-12 w-12 bg-gray-200 rounded animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // card type
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
