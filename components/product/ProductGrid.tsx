import ProductCard, { ProductCardData } from "./ProductCard";

export default function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-16 text-cream/60">
        No products found.
      </div>
    );
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
