"use client";

import Link from "next/link";
import { Heart, Star, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, calcDiscountedPrice } from "@/lib/utils";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { resolveProductImageSrc, PLACEHOLDER_IMAGE } from "@/lib/images";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount: number;
  images: string[];
  categorySlug: string;
  avgRating?: number;
  reviewCount?: number;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const finalPrice = calcDiscountedPrice(product.price, product.discount);
  const inWishlist = isInWishlist(product.id);
  const [imgError, setImgError] = useState(false);
  const image = imgError
    ? PLACEHOLDER_IMAGE
    : resolveProductImageSrc(product.categorySlug, product.images[0]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      categorySlug: product.categorySlug,
      price: product.price,
      discount: product.discount,
      image,
    });
    toast.success("Added to cart!");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      categorySlug: product.categorySlug,
      price: product.price,
      discount: product.discount,
      image,
    });
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <Link
      href={`/products/${product.categorySlug}/${product.slug}`}
      className="group block bg-card rounded-lg border border-gold/10 hover:border-gold transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2">
            <Badge variant="gold">-{product.discount}%</Badge>
          </div>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-navy/80 rounded-full hover:bg-gold hover:text-navy transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 ${inWishlist ? "fill-gold text-gold" : "text-cream"}`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-cream line-clamp-2 mb-1 group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.round(product.avgRating || 4)
                  ? "fill-gold text-gold"
                  : "text-cream/20"
              }`}
            />
          ))}
          <span className="text-xs text-cream/50 ml-1">
            ({product.reviewCount || 0})
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-gold font-semibold">{formatPrice(finalPrice)}</span>
          {product.discount > 0 && (
            <span className="text-cream/40 text-sm line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="w-full"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Link>
  );
}
