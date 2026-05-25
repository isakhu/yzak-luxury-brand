"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, getDeliveryFee } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { calcDiscountedPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee(subtotal, false);
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-3xl text-gold mb-4">Your Cart</h1>
        <p className="text-cream/60 mb-8">Your cart is empty.</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl text-gold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = calcDiscountedPrice(item.price, item.discount);
            const key = `${item.productId}-${item.size || ""}-${item.color || ""}`;
            return (
              <div
                key={key}
                className="flex gap-4 bg-card rounded-lg p-4 border border-gold/10"
              >
                <div className="relative w-24 h-24 shrink-0 rounded overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.categorySlug}/${item.slug}`}
                    className="font-medium text-cream hover:text-gold line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  {(item.size || item.color) && (
                    <p className="text-cream/50 text-sm mt-1">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-gold font-semibold mt-1">
                    {formatPrice(price)}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity - 1,
                          item.size,
                          item.color
                        )
                      }
                      className="p-1 border border-gold/30 rounded hover:bg-gold/10"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-cream w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity + 1,
                          item.size,
                          item.color
                        )
                      }
                      className="p-1 border border-gold/30 rounded hover:bg-gold/10"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        removeItem(item.productId, item.size, item.color)
                      }
                      className="ml-auto p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card rounded-lg p-6 border border-gold/20 h-fit">
          <h2 className="font-heading text-xl text-gold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-cream/70">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cream/70">Delivery</span>
              <span>
                {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
              </span>
            </div>
            {subtotal < 5000 && (
              <p className="text-xs text-cream/50">
                Free delivery on orders above 5,000 ብር
              </p>
            )}
          </div>
          <div className="flex justify-between font-bold text-gold border-t border-gold/20 pt-4 mb-6">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link href="/checkout">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
