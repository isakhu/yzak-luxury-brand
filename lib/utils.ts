export function formatPrice(price: number): string {
  return `${price.toLocaleString("en-ET")} ብር`;
}

export function calcDiscountedPrice(price: number, discount: number): number {
  return price - (price * discount) / 100;
}

export const CATEGORIES = [
  { name: "Gold", slug: "gold" },
  { name: "Diamonds", slug: "diamonds" },
  { name: "Clothes", slug: "clothes" },
  { name: "Shoes", slug: "shoes" },
  { name: "Watches", slug: "watches" },
  { name: "Handbags", slug: "handbags" },
  { name: "Accessories", slug: "accessories" },
] as const;

export const DELIVERY_FREE_THRESHOLD = 5000;
export const STANDARD_DELIVERY_FEE = 100;
export const EXPRESS_DELIVERY_FEE = 150;

export function getDeliveryFee(subtotal: number, express: boolean): number {
  if (express) return EXPRESS_DELIVERY_FEE;
  if (subtotal >= DELIVERY_FREE_THRESHOLD) return 0;
  return STANDARD_DELIVERY_FEE;
}
