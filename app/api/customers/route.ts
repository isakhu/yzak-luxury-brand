import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: { select: { totalAmount: true } },
      _count: { select: { orders: true } },
    },
  });

  const result = customers.map((c) => ({
    ...c,
    orderCount: c._count.orders,
    totalSpent: c.orders.reduce((s, o) => s + o.totalAmount, 0),
  }));

  return NextResponse.json(result);
}
