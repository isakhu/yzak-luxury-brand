export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CONTACT } from "@/lib/contact";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: { category: string; slug: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await prisma.product
    .findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
      },
    })
    .catch(() => null);

  if (!product) notFound();

  const related = await prisma.product
    .findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: "ACTIVE",
      },
      take: 4,
      include: { category: true, reviews: true },
    })
    .catch(() => []);

  const contact = {
    phone: CONTACT.phone,
    phoneTel: CONTACT.phoneTel,
    whatsappUrl: CONTACT.whatsappUrl,
    telegramUrl: CONTACT.telegramUrl,
    hawassaAddress: CONTACT.hawassaAddress,
  };

  const relatedMapped = related.map((p) => ({
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

  return (
    <ProductDetailClient
      product={product}
      categorySlug={params.category}
      contact={contact}
      related={relatedMapped}
    />
  );
}
