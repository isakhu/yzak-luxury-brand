"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export type PaymentMethod = "telebirr" | "cbe" | "cod";

interface MockPaymentFormProps {
  method: PaymentMethod;
  onPay: (phone?: string) => void;
  loading?: boolean;
}

export default function MockPaymentForm({
  method,
  onPay,
  loading,
}: MockPaymentFormProps) {
  const [phone, setPhone] = useState("");

  if (method === "cod") {
    return (
      <div className="space-y-4">
        <p className="text-cream/70">
          Pay with cash when your order is delivered. Your order will be placed
          with payment status Pending until delivery.
        </p>
        <Button onClick={() => onPay()} loading={loading} className="w-full">
          Confirm Cash on Delivery
        </Button>
      </div>
    );
  }

  const label = method === "telebirr" ? "Telebirr (Test)" : "CBE Birr (Test)";

  return (
    <div className="space-y-4">
      <p className="text-cream/70">
        {label} — Enter your phone number and click Pay. This is a mock payment;
        your order will be marked as PAID instantly.
      </p>
      <div>
        <label className="block text-sm text-cream/70 mb-1">Phone (+251)</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="9XX XXX XXX"
          className="w-full px-4 py-2 bg-navy border border-gold/20 rounded-md text-cream focus:outline-none focus:border-gold"
        />
      </div>
      <Button
        onClick={() => onPay(phone)}
        loading={loading}
        disabled={!phone.trim()}
        className="w-full"
      >
        Pay with {label}
      </Button>
    </div>
  );
}
