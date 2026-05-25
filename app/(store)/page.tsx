export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/product/ProductGrid";
import { ProductCardData } from "@/components/product/ProductCard";
import HeroBanner from "@/components/home/HeroBanner";
import { CATEGORIES } from "@/lib/utils";
import { getCategoryImage, getProductImages } from "@/lib/images";
import { CITY_VIBE_IMAGES } from "@/lib/images";

async function getProducts(featured?: boolean, limit = 8): Promise<ProductCardData[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", ...(featured ? { featured: true } : {}) },
      take: limit,
      orderBy: featured ? undefined : { createdAt: "desc" },
      include: { category: true, reviews: true },
    });
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      discount: p.discount,
      images: p.images,
      categorySlug: p.category.slug,
      avgRating:
        p.reviews.length > 0
          ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
          : 4,
      reviewCount: p.reviews.length,
    }));
  } catch {
    return Array.from({ length: limit }, (_, i) => ({
      id: `placeholder-${i}`,
      name: `Luxury Product ${i + 1}`,
      slug: `product-${i + 1}`,
      price: 15000 + i * 2000,
      discount: i % 3 === 0 ? 10 : 0,
      images: getProductImages("gold", i),
      categorySlug: "gold",
      avgRating: 4,
      reviewCount: 12,
    }));
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany();
  } catch {
    return CATEGORIES.map((c) => ({
      id: c.slug,
      name: c.name,
      slug: c.slug,
      image: getCategoryImage(c.slug),
    }));
  }
}

export default async function HomePage() {
  const [categories, newArrivals, bestSellers] = await Promise.all([
    getCategories(),
    getProducts(false, 8),
    getProducts(true, 8),
  ]);

  return (
    <div>
      <HeroBanner />

      <section className="relative py-20 min-h-[320px] overflow-hidden">
        <Image
          src={CITY_VIBE_IMAGES[1]}
          alt="Ethiopia"
          fill
          className="object-cover brightness-[0.4]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-heading text-3xl md:text-4xl text-gold mb-4">
            About Yzak Luxury Brand
          </h2>
          <p className="text-cream/80 leading-relaxed">
            Based in Hawassa and serving customers across Ethiopia, Yzak Luxury
            Brand brings you fine gold, diamonds, fashion, and accessories —
            with the warmth and beauty of our homeland at every step.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="font-heading text-3xl text-gold mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="group relative aspect-[4/5] rounded-lg overflow-hidden border border-gold/10 hover:border-gold transition-colors"
            >
              <Image
                src={cat.image || getCategoryImage(cat.slug)}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
              <span className="absolute bottom-3 left-0 right-0 text-center font-heading text-cream group-hover:text-gold transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-3xl text-gold">New Arrivals</h2>
          <Link href="/products/clothes" className="text-gold hover:underline text-sm">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      <section className="bg-card/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl text-gold">Best Sellers</h2>
            <Link href="/products/diamonds" className="text-gold hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <ProductGrid products={bestSellers.length ? bestSellers : newArrivals} />
          </div>
        </div>
      </section>
    </div>
  );
}
