import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { normalizeProductImages } from "@/lib/images";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const rating = searchParams.get("rating");
  const inStock = searchParams.get("inStock");
  const sort = searchParams.get("sort") || "newest";
  const featured = searchParams.get("featured");
  const admin = searchParams.get("admin") === "true";

  const where: Record<string, unknown> = admin ? {} : { status: "ACTIVE" };

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }

  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
  }

  if (inStock === "true") {
    where.stock = { gt: 0 };
  }

  if (featured === "true") {
    where.featured = true;
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      reviews: { select: { rating: true } },
    },
  });

  let result = products.map((p) => {
    const avgRating =
      p.reviews.length > 0
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : 4;
    return {
      ...p,
      categorySlug: p.category.slug,
      avgRating,
      reviewCount: p.reviews.length,
    };
  });

  if (rating) {
    const minR = parseInt(rating);
    result = result.filter((p) => p.avgRating >= minR);
  }

  if (sort === "rating") {
    result.sort((a, b) => b.avgRating - a.avgRating);
  }

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const category = await prisma.category.findUnique({
    where: { id: body.categoryId },
  });
  const categorySlug = category?.slug ?? "gold";
  const images = normalizeProductImages(categorySlug, body.images || []);

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      slug: body.slug,
      price: parseFloat(body.price),
      discount: parseFloat(body.discount || 0),
      brand: body.brand,
      stock: parseInt(body.stock || 0),
      images,
      sizes: body.sizes || [],
      colors: body.colors || [],
      featured: body.featured || false,
      status: body.status || "ACTIVE",
      categoryId: body.categoryId,
    },
  });

  return NextResponse.json(product);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const category = await prisma.category.findUnique({
    where: { id: body.categoryId },
  });
  const categorySlug = category?.slug ?? "gold";
  const images = normalizeProductImages(categorySlug, body.images || []);

  const product = await prisma.product.update({
    where: { id: body.id },
    data: {
      name: body.name,
      description: body.description,
      slug: body.slug,
      price: parseFloat(body.price),
      discount: parseFloat(body.discount || 0),
      brand: body.brand,
      stock: parseInt(body.stock || 0),
      images,
      sizes: body.sizes || [],
      colors: body.colors || [],
      featured: body.featured,
      status: body.status,
      categoryId: body.categoryId,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
