import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminDashboard() {
  let recentOrders: Prisma.OrderGetPayload<{
    include: { user: true };
  }>[] = [];
  let orderCount = 0;
  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let customers = 0;
  let revenue = { _sum: { totalAmount: null as number | null } };

  try {
    [recentOrders, orderCount, products, customers, revenue] = await Promise.all([
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.order.count(),
      prisma.product.findMany(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "PAID" },
      }),
    ]);
  } catch {
    // Database not configured yet
  }

  const orders = recentOrders;
  const lowStock = products.filter((p) => p.stock < 5);

  const metrics = [
    {
      label: "Total Revenue",
      value: formatPrice(revenue._sum.totalAmount || 0),
    },
    { label: "Total Orders", value: orderCount.toString() },
    { label: "Total Products", value: products.length.toString() },
    { label: "Total Customers", value: customers.toString() },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl text-gold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-card rounded-lg p-6 border border-gold/20"
          >
            <p className="text-cream/60 text-sm mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-gold">{m.value}</p>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
          <h3 className="text-yellow-400 font-medium mb-2">Low Stock Alerts</h3>
          <ul className="text-sm space-y-1">
            {lowStock.map((p) => (
              <li key={p.id} className="text-cream/80">
                {p.name} — only {p.stock} left
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="font-heading text-xl text-gold mb-4">Recent Orders</h2>
      <div className="overflow-x-auto bg-card rounded-lg border border-gold/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-cream/60 text-left">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gold/10">
                <td className="p-3 font-mono text-xs">
                  <Link
                    href={`/admin/orders?id=${order.id}`}
                    className="text-gold hover:underline"
                  >
                    {order.id.slice(0, 10)}...
                  </Link>
                </td>
                <td className="p-3">{order.user.name || order.user.email}</td>
                <td className="p-3 text-gold">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="p-3">{order.deliveryStatus}</td>
                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
