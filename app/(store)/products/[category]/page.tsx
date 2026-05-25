export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductListingClient from "./ProductListingClient";

interface PageProps {
  params: { category: string };
  searchParams: {
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    inStock?: string;
    sort?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  }).catch(() => null);

  const where: Record<string, unknown> = {
    status: "ACTIVE",
    ...(category ? { categoryId: category.id } : {}),
  };

  if (searchParams.q) {
    where.name = { contains: searchParams.q, mode: "insensitive" };
  }
  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice) {
      (where.price as Record<string, number>).gte = parseFloat(searchParams.minPrice);
    }
    if (searchParams.maxPrice) {
      (where.price as Record<string, number>).lte = parseFloat(searchParams.maxPrice);
    }
  }
  if (searchParams.inStock === "true") {
    where.stock = { gt: 0 };
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (searchParams.sort === "price-asc") orderBy = { price: "asc" };
  if (searchParams.sort === "price-desc") orderBy = { price: "desc" };

  const products = await prisma.product
    .findMany({
      where,
      orderBy,
      include: { category: true, reviews: true },
    })
    .catch(() => []);

  let mapped = products.map((p) => {
    const avgRating =
      p.reviews.length > 0
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : 4;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      discount: p.discount,
      images: p.images,
      categorySlug: p.category.slug,
      avgRating,
      reviewCount: p.reviews.length,
    };
  });

  if (searchParams.rating) {
    const minR = parseInt(searchParams.rating);
    mapped = mapped.filter((p) => p.avgRating >= minR);
  }
  if (searchParams.sort === "rating") {
    mapped.sort((a, b) => b.avgRating - a.avgRating);
  }

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <ProductListingClient
        categoryName={category?.name || params.category}
        categorySlug={params.category}
        initialProducts={mapped}
      />
    </Suspense>
  );
}
