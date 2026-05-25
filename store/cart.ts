import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  discount: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const key = `${item.productId}-${item.size || ""}-${item.color || ""}`;
        set((state) => {
          const existing = state.items.find(
            (i) =>
              `${i.productId}-${i.size || ""}-${i.color || ""}` === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.productId}-${i.size || ""}-${i.color || ""}` === key
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: item.quantity || 1 },
            ],
          };
        });
      },
      removeItem: (productId, size, color) => {
        const key = `${productId}-${size || ""}-${color || ""}`;
        set((state) => ({
          items: state.items.filter(
            (i) => `${i.productId}-${i.size || ""}-${i.color || ""}` !== key
          ),
        }));
      },
      updateQuantity: (productId, quantity, size, color) => {
        const key = `${productId}-${size || ""}-${color || ""}`;
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            `${i.productId}-${i.size || ""}-${i.color || ""}` === key
              ? { ...i, quantity }
              : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () =>
        get().items.reduce((sum, item) => {
          const price = item.price - (item.price * item.discount) / 100;
          return sum + price * item.quantity;
        }, 0),
      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "yzak-cart" }
  )
);
