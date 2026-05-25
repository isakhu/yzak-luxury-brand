import ProductSkeleton from "@/components/product/ProductSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 skeleton rounded mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <ProductSkeleton count={8} />
      </div>
    </div>
  );
}
