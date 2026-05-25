export default function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg overflow-hidden">
          <div className="aspect-square skeleton" />
          <div className="p-4 space-y-3">
            <div className="h-4 skeleton rounded w-3/4" />
            <div className="h-3 skeleton rounded w-1/2" />
            <div className="h-8 skeleton rounded w-full" />
          </div>
        </div>
      ))}
    </>
  );
}
