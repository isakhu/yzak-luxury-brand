export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Check } from "lucide-react";

const STEPS = [
  { key: "PLACED", label: "Order Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PACKED", label: "Packed" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

const STATUS_ORDER = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

interface PageProps {
  params: { id: string };
}

export default async function TrackOrderPage({ params }: PageProps) {
  const session = await auth();
  const order = await prisma.order
    .findUnique({
      where: { id: params.id },
      include: { address: true },
    })
    .catch(() => null);

  if (!order) notFound();

  const isAdmin = session?.user?.role === "ADMIN";
  if (session?.user?.id && order.userId !== session.user.id && !isAdmin) {
    notFound();
  }

  const currentIndex = STATUS_ORDER.indexOf(order.deliveryStatus);
  const cancelled = order.deliveryStatus === "CANCELLED";

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-heading text-3xl text-gold mb-2">Track Order</h1>
      <p className="text-cream/60 text-sm font-mono mb-8">{order.id}</p>

      {cancelled ? (
        <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 text-red-400">
          This order has been cancelled.
        </div>
      ) : (
        <div className="space-y-0">
          {STEPS.map((step, i) => {
            const done = i <= currentIndex;
            const active = i === currentIndex;
            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      done
                        ? "bg-gold border-gold text-navy"
                        : "border-gold/30 text-cream/40"
                    } ${active ? "ring-4 ring-gold/30" : ""}`}
                  >
                    {done ? <Check className="w-5 h-5" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 min-h-[40px] ${
                        i < currentIndex ? "bg-gold" : "bg-gold/20"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-8 pt-2">
                  <p
                    className={`font-medium ${
                      done ? "text-gold" : "text-cream/50"
                    }`}
                  >
                    {step.label}
                  </p>
                  {active && order.agentName && (
                    <p className="text-sm text-cream/70 mt-1">
                      Agent: {order.agentName}
                      {order.agentPhone && ` — ${order.agentPhone}`}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {order.agentName && !cancelled && (
        <div className="mt-4 bg-card rounded-lg p-4 border border-gold/20">
          <h3 className="text-gold font-heading mb-2">Delivery Agent</h3>
          <p className="text-cream">{order.agentName}</p>
          {order.agentPhone && (
            <a href={`tel:${order.agentPhone}`} className="text-gold text-sm">
              {order.agentPhone}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
