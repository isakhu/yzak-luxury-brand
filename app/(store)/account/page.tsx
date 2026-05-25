"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useWishlistStore } from "@/store/wishlist";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  totalAmount: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
}

interface Address {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  detail: string | null;
  isDefault: boolean;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const wishlistItems = useWishlistStore((s) => s.items);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(() => {});
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-cream/60">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-3xl text-gold mb-4">My Account</h1>
        <p className="text-cream/60 mb-8">
          Sign in to manage your orders and wishlist.
        </p>
        <Link href="/auth/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const wishlistProducts: ProductCardData[] = wishlistItems.map((w) => ({
    id: w.productId,
    name: w.name,
    slug: w.slug,
    price: w.price,
    discount: w.discount,
    images: [w.image],
    categorySlug: w.categorySlug,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl text-gold mb-8">My Account</h1>

      <div className="bg-card rounded-lg p-6 border border-gold/20 mb-8 flex items-center gap-4">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt=""
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <p className="font-medium text-cream text-lg">
            {session.user?.name || "Customer"}
          </p>
          <p className="text-cream/60 text-sm">{session.user?.email}</p>
          {session.user?.role === "ADMIN" && (
            <Link href="/admin" className="text-gold text-sm hover:underline">
              Go to Admin Dashboard →
            </Link>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => signOut()}
        >
          Logout
        </Button>
      </div>

      <section className="mb-12">
        <h2 className="font-heading text-xl text-gold mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-cream/60">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/20 text-cream/60 text-left">
                  <th className="py-2 pr-4">Order ID</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gold/10">
                    <td className="py-3 pr-4 font-mono text-xs">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 pr-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 text-gold">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-3 pr-4">{order.deliveryStatus}</td>
                    <td className="py-3">
                      <Link
                        href={`/track/${order.id}`}
                        className="text-gold hover:underline"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {addresses.length > 0 && (
        <section className="mb-12">
          <h2 className="font-heading text-xl text-gold mb-4">Saved Addresses</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-card rounded-lg p-4 border border-gold/10"
              >
                <p className="font-medium">{addr.fullName}</p>
                <p className="text-cream/60 text-sm">{addr.city}</p>
                <p className="text-cream/60 text-sm">{addr.detail}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-heading text-xl text-gold mb-4">Wishlist</h2>
        {wishlistProducts.length === 0 ? (
          <p className="text-cream/60">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {wishlistProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
