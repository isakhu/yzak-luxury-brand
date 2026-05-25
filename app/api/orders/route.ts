import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const admin = session.user.role === "ADMIN";

  if (id) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        address: true,
        user: true,
      },
    });
    if (!order || (!admin && order.userId !== session.user.id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  const orders = await prisma.order.findMany({
    where: admin ? {} : { userId: session.user.id },
    include: {
      items: { include: { product: true } },
      address: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    items,
    address,
    totalAmount,
    deliveryFee,
    paymentMethod,
    paymentStatus,
  } = body;

  let addressId = address.id;
  if (!addressId) {
    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName: address.fullName,
        phone: address.phone,
        city: address.city,
        subcity: address.subcity,
        woreda: address.woreda,
        detail: address.detail,
        isDefault: false,
      },
    });
    addressId = newAddress.id;
  }

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      totalAmount,
      deliveryFee,
      paymentMethod,
      paymentStatus: paymentStatus || "PENDING",
      deliveryStatus: "PLACED",
      addressId,
      items: {
        create: items.map(
          (item: {
            productId: string;
            quantity: number;
            price: number;
            size?: string;
            color?: string;
          }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })
        ),
      },
    },
    include: {
      items: { include: { product: true } },
      address: true,
    },
  });

  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const order = await prisma.order.update({
    where: { id: body.id },
    data: {
      deliveryStatus: body.deliveryStatus,
      paymentStatus: body.paymentStatus,
      agentName: body.agentName,
      agentPhone: body.agentPhone,
    },
    include: {
      items: { include: { product: true } },
      address: true,
      user: true,
    },
  });

  return NextResponse.json(order);
}
