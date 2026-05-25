"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
  agentName: string | null;
  agentPhone: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
  address: {
    fullName: string;
    phone: string;
    city: string;
    detail: string | null;
  };
  items: OrderItem[];
}

const DELIVERY_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");

  const load = () =>
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      });

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && orders.length) {
      const order = orders.find((o) => o.id === id);
      if (order) openDetail(order);
    }
  }, [searchParams, orders]);

  const openDetail = (order: Order) => {
    setSelected(order);
    setDeliveryStatus(order.deliveryStatus);
    setAgentName(order.agentName || "");
    setAgentPhone(order.agentPhone || "");
  };

  const handleUpdate = async () => {
    if (!selected) return;
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selected.id,
        deliveryStatus,
        agentName,
        agentPhone,
      }),
    });
    if (res.ok) {
      toast.success("Order updated");
      setSelected(null);
      load();
    } else {
      toast.error("Update failed");
    }
  };

  const filtered = filter
    ? orders.filter(
        (o) =>
          o.deliveryStatus === filter ||
          o.paymentStatus === filter ||
          o.id.includes(filter)
      )
    : orders;

  return (
    <div>
      <h1 className="font-heading text-3xl text-gold mb-8">Orders</h1>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 px-4 py-2 bg-card border border-gold/20 rounded text-cream text-sm"
      >
        <option value="">All Orders</option>
        {DELIVERY_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="overflow-x-auto bg-card rounded-lg border border-gold/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-cream/60 text-left">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Delivery</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-gold/10">
                <td className="p-3 font-mono text-xs">
                  {order.id.slice(0, 10)}...
                </td>
                <td className="p-3">{order.user.email}</td>
                <td className="p-3 text-gold">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="p-3">{order.paymentStatus}</td>
                <td className="p-3">{order.deliveryStatus}</td>
                <td className="p-3">
                  <button
                    onClick={() => openDetail(order)}
                    className="text-gold hover:underline"
                  >
                    View
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
        title="Order Details"
        size="lg"
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-cream/60">Customer</p>
              <p>
                {selected.user.name} ({selected.user.email})
              </p>
            </div>
            <div>
              <p className="text-cream/60">Address</p>
              <p>
                {selected.address.fullName}, {selected.address.city} —{" "}
                {selected.address.phone}
              </p>
              {selected.address.detail && <p>{selected.address.detail}</p>}
            </div>
            <div>
              <p className="text-cream/60 mb-2">Items</p>
              {selected.items.map((item) => (
                <div key={item.id} className="flex justify-between py-1">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <p className="font-bold text-gold mt-2">
                Total: {formatPrice(selected.totalAmount)}
              </p>
            </div>
            <div>
              <label className="text-cream/60 block mb-1">Delivery Status</label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
                className="w-full px-3 py-2 bg-navy border border-gold/20 rounded text-cream"
              >
                {DELIVERY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-cream/60 block mb-1">Agent Name</label>
                <input
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-3 py-2 bg-navy border border-gold/20 rounded text-cream"
                />
              </div>
              <div>
                <label className="text-cream/60 block mb-1">Agent Phone</label>
                <input
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-navy border border-gold/20 rounded text-cream"
                />
              </div>
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Update Order
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
