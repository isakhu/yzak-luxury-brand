export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

interface PageProps {
  params: { id: string };
}

export default async function OrderConfirmedPage({ params }: PageProps) {
  const session = await auth();
  const order = await prisma.order
    .findUnique({
      where: { id: params.id },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    })
    .catch(() => null);

  if (!order || (session?.user?.id && order.userId !== session.user.id)) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="success-check inline-flex mb-6">
        <CheckCircle className="w-20 h-20 text-gold" />
      </div>
      <h1 className="font-heading text-3xl text-gold mb-2">Order Confirmed!</h1>
      <p className="text-cream/70 mb-8">
        Thank you for shopping with Yzak Luxury Brand
      </p>

      <div className="bg-card rounded-lg p-6 border border-gold/20 text-left mb-8">
        <p className="text-sm text-cream/60 mb-1">Order ID</p>
        <p className="font-mono text-gold mb-4">{order.id}</p>

        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gold/20 pt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-cream/70">Delivery Fee</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-bold text-gold">
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
          <p className="text-cream/60 mt-2">
            Deliver to: {order.address.fullName}, {order.address.city}
            {order.address.detail && ` — ${order.address.detail}`}
          </p>
          <p className="text-cream/60">
            Payment: {order.paymentMethod} ({order.paymentStatus})
          </p>
        </div>
      </div>

      <Link href="/account">
        <Button>View My Orders</Button>
      </Link>
    </div>
  );
}
