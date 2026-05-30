"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import {
  formatPrice,
  getDeliveryFee,
  calcDiscountedPrice,
} from "@/lib/utils";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import MockPaymentForm, { PaymentMethod } from "@/components/checkout/MockPaymentForm";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const _sessionHook = useSession() as
    | { data?: any; status?: "loading" | "authenticated" | "unauthenticated" }
    | undefined;
  const session = _sessionHook?.data;
  const status = _sessionHook?.status ?? "unauthenticated";
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    city: "Hawassa",
    subcity: "",
    woreda: "",
    detail: "",
  });
  const [express, setExpress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("telebirr");

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee(subtotal, express);
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-cream/60">Your cart is empty.</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-3xl text-gold mb-4">Checkout</h1>
        <p className="text-cream/60 mb-6">Please sign in to complete your order.</p>
        <Link href="/auth/login">
          <Button>Sign In to Checkout</Button>
        </Link>
      </div>
    );
  }

  const placeOrder = async (phone?: string) => {
    setLoading(true);
    try {
      const paymentStatus =
        paymentMethod === "cod" ? "PENDING" : "PAID";

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: calcDiscountedPrice(item.price, item.discount),
            size: item.size,
            color: item.color,
          })),
          address: {
            ...address,
            phone: phone || address.phone,
          },
          totalAmount: total,
          deliveryFee,
          paymentMethod:
            paymentMethod === "telebirr"
              ? "Telebirr (Test)"
              : paymentMethod === "cbe"
              ? "CBE Birr (Test)"
              : "Cash on Delivery",
          paymentStatus,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      const order = await res.json();
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order-confirmed/${order.id}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-heading text-3xl text-gold mb-6">Checkout</h1>
      <CheckoutSteps current={step} />

      {step === 0 && (
        <div className="bg-card rounded-lg p-6 border border-gold/10 space-y-4">
          <h2 className="font-heading text-xl text-gold">Delivery Address</h2>
          {[
            { key: "fullName", label: "Full Name", type: "text" },
            { key: "phone", label: "Phone (+251)", type: "tel", placeholder: "9XX XXX XXX" },
            { key: "subcity", label: "Subcity", type: "text" },
            { key: "woreda", label: "Woreda", type: "text" },
            { key: "detail", label: "Address Detail", type: "text" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-sm text-cream/70 block mb-1">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={address[key as keyof typeof address]}
                onChange={(e) =>
                  setAddress({ ...address, [key]: e.target.value })
                }
                className="w-full px-4 py-2 bg-navy border border-gold/20 rounded text-cream"
              />
            </div>
          ))}
          <div>
            <label className="text-sm text-cream/70 block mb-1">City</label>
            <select
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full px-4 py-2 bg-navy border border-gold/20 rounded text-cream"
            >
              <option>Hawassa</option>
              <option>Dire Dawa</option>
              <option>Other</option>
            </select>
          </div>
          <Button
            onClick={() => {
              if (!address.fullName || !address.phone) {
                toast.error("Please fill required fields");
                return;
              }
              setStep(1);
            }}
            className="w-full"
          >
            Continue to Delivery
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="bg-card rounded-lg p-6 border border-gold/10 space-y-4">
          <h2 className="font-heading text-xl text-gold">Delivery Option</h2>
          <label className="flex items-start gap-3 p-4 border border-gold/20 rounded cursor-pointer">
            <input
              type="radio"
              checked={!express}
              onChange={() => setExpress(false)}
              className="mt-1 accent-gold"
            />
            <div>
              <p className="font-medium">Standard Delivery (2-3 days)</p>
              <p className="text-sm text-cream/60">
                {subtotal >= 5000 ? "Free" : "100 ብር"} — Hawassa & Dire Dawa
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-4 border border-gold/20 rounded cursor-pointer">
            <input
              type="radio"
              checked={express}
              onChange={() => setExpress(true)}
              className="mt-1 accent-gold"
            />
            <div>
              <p className="font-medium">Express Same-Day</p>
              <p className="text-sm text-cream/60">+150 ብር</p>
            </div>
          </label>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button onClick={() => setStep(2)} className="flex-1">
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-card rounded-lg p-6 border border-gold/10 space-y-4">
          <h2 className="font-heading text-xl text-gold">Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(["telebirr", "cbe", "cod"] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`p-3 rounded border text-sm ${
                  paymentMethod === m
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-gold/20 text-cream"
                }`}
              >
                {m === "telebirr"
                  ? "Telebirr (Test)"
                  : m === "cbe"
                  ? "CBE Birr (Test)"
                  : "Cash on Delivery"}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} className="flex-1">
              Continue to Review
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-card rounded-lg p-6 border border-gold/10 space-y-4">
          <h2 className="font-heading text-xl text-gold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span className="text-cream/70">
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {formatPrice(
                    calcDiscountedPrice(item.price, item.discount) * item.quantity
                  )}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-gold/20 pt-2">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-gold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <p className="text-sm text-cream/60">
            Payment:{" "}
            {paymentMethod === "telebirr"
              ? "Telebirr (Test)"
              : paymentMethod === "cbe"
              ? "CBE Birr (Test)"
              : "Cash on Delivery"}
          </p>
          <MockPaymentForm
            method={paymentMethod}
            onPay={() => placeOrder()}
            loading={loading}
          />
          <Button variant="outline" onClick={() => setStep(2)}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
