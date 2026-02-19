export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
