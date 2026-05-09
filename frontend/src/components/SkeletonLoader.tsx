export function SkeletonLoader({ count = 1, type = 'card' }: { count?: number; type?: 'card' | 'table-row' | 'text' }) {
  if (type === 'text') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded-full animate-pulse" style={{ width: `${Math.floor(Math.random() * (100 - 60 + 1) + 60)}%` }} />
        ))}
      </div>
    );
  }

  if (type === 'table-row') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card/50">
            <div className="h-10 w-10 bg-muted rounded-lg animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-muted rounded w-1/4 animate-pulse opacity-50" />
            </div>
            <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card/50 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-muted rounded-lg w-1/4 animate-pulse" />
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded-full w-full animate-pulse" />
            <div className="h-4 bg-muted rounded-full w-5/6 animate-pulse opacity-70" />
            <div className="h-4 bg-muted rounded-full w-2/3 animate-pulse opacity-40" />
          </div>
        </div>
      ))}
    </div>
  );
}
