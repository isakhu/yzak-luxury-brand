import { Suspense } from "react";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="text-cream/60">Loading...</div>}>{children}</Suspense>;
}
