"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { ProductCardData } from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

interface Props {
  categoryName: string;
  categorySlug: string;
  initialProducts: ProductCardData[];
}

export default function ProductListingClient({
  categoryName,
  categorySlug,
  initialProducts,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (rating) params.set("rating", rating);
    if (inStock) params.set("inStock", "true");
    if (sort) params.set("sort", sort);
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`/products/${categorySlug}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl text-gold mb-6 capitalize">
        {categoryName}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0 space-y-6">
          <div className="bg-card rounded-lg p-4 border border-gold/10">
            <h3 className="font-heading text-gold mb-4">Filters</h3>

            <div className="mb-4">
              <label className="text-sm text-cream/70 block mb-2">Price Range (ብር)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-navy border border-gold/20 rounded text-sm text-cream"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-navy border border-gold/20 rounded text-sm text-cream"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-cream/70 block mb-2">Minimum Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 bg-navy border border-gold/20 rounded text-sm text-cream"
              >
                <option value="">Any</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-cream/70 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="accent-gold"
              />
              In Stock Only
            </label>

            <Button onClick={applyFilters} className="w-full" size="sm">
              Apply Filters
            </Button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                const params = new URLSearchParams(searchParams.toString());
                params.set("sort", e.target.value);
                router.push(`/products/${categorySlug}?${params.toString()}`);
              }}
              className="px-4 py-2 bg-card border border-gold/20 rounded text-sm text-cream"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <ProductGrid products={initialProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
