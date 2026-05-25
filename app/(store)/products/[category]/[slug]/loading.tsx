export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square skeleton rounded-lg" />
        <div className="space-y-4">
          <div className="h-10 skeleton rounded w-3/4" />
          <div className="h-6 skeleton rounded w-1/2" />
          <div className="h-8 skeleton rounded w-1/3" />
          <div className="h-32 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}
