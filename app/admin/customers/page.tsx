"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import Modal from "@/components/ui/Modal";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

interface Order {
  id: string;
  totalAmount: number;
  deliveryStatus: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
      });
  }, []);

  const viewOrders = async (customer: Customer) => {
    setSelected(customer);
    const allOrders = await fetch("/api/orders").then((r) => r.json());
    if (Array.isArray(allOrders)) {
      setOrders(
        allOrders.filter(
          (o: Order & { user: { email: string } }) =>
            o.user?.email === customer.email
        )
      );
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-gold mb-8">Customers</h1>

      <div className="overflow-x-auto bg-card rounded-lg border border-gold/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-cream/60 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-gold/10">
                <td className="p-3">{c.name || "—"}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.orderCount}</td>
                <td className="p-3 text-gold">{formatPrice(c.totalSpent)}</td>
                <td className="p-3">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => viewOrders(c)}
                    className="text-gold hover:underline"
                  >
                    View Orders
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Orders — ${selected?.email}`}
        size="lg"
      >
        {orders.length === 0 ? (
          <p className="text-cream/60">No orders found.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <div
                key={o.id}
                className="flex justify-between py-2 border-b border-gold/10 text-sm"
              >
                <span className="font-mono text-xs">{o.id.slice(0, 12)}...</span>
                <span>{o.deliveryStatus}</span>
                <span className="text-gold">{formatPrice(o.totalAmount)}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
