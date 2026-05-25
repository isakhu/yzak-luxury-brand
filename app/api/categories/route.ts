import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCategoryImage, toLocalImagePath } from "@/lib/images";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-");
  const image = body.image?.startsWith("http")
    ? body.image
    : body.image
      ? toLocalImagePath(slug, body.image)
      : getCategoryImage(slug);
  const category = await prisma.category.create({
    data: { name: body.name, slug, image },
  });
  return NextResponse.json(category);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const slug = body.slug;
  const image = body.image
    ? toLocalImagePath(slug, body.image)
    : undefined;
  const category = await prisma.category.update({
    where: { id: body.id },
    data: {
      name: body.name,
      slug: body.slug,
      ...(image !== undefined ? { image } : {}),
    },
  });
  return NextResponse.json(category);
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

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
