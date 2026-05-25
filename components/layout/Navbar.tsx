"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { CATEGORIES } from "@/lib/utils";
import SocialLinks from "@/components/layout/SocialLinks";

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products/gold?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search luxury products..."
          className="w-full pl-4 pr-10 py-2 bg-card border border-gold/20 rounded-md text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gold"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}

export default function Navbar() {
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-navy border-b border-gold/20">
      <div className="bg-gold text-navy text-xs sm:text-sm py-1.5 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
          <span className="font-medium text-center">
            Free delivery in Hawassa & Dire Dawa on orders above 5,000 ብር
          </span>
          <SocialLinks showPhone size="sm" className="text-navy [&_a]:text-navy [&_svg]:text-navy" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="shrink-0">
            <span className="font-heading text-lg md:text-xl font-bold text-gold tracking-wider">
              YZAK LUXURY BRAND
            </span>
          </Link>

          <div className="hidden md:block flex-1">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/cart"
              className="relative p-2 text-cream hover:text-gold transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-navy text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className="relative p-2 text-cream hover:text-gold transition-colors"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-navy text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/auth/login"
              className="p-2 text-cream hover:text-gold transition-colors"
              title="Account"
            >
              <User className="w-6 h-6" />
            </Link>
            <button
              className="md:hidden p-2 text-cream"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="md:hidden mt-3">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      <nav className="border-t border-gold/10 overflow-x-auto">
        <div className="container mx-auto px-4 flex gap-1 md:gap-4 py-2 min-w-max md:min-w-0 md:justify-center">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="px-3 py-1.5 text-sm text-cream/80 hover:text-gold whitespace-nowrap transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-gold/10 bg-card p-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="block py-2 text-cream hover:text-gold"
              onClick={() => setMobileOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
