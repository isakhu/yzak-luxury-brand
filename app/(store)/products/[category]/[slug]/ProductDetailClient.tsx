"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Phone, Heart, MapPin } from "lucide-react";
import SocialLinks from "@/components/layout/SocialLinks";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, calcDiscountedPrice } from "@/lib/utils";
import { resolveProductImageSrc } from "@/lib/images";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProductGrid from "@/components/product/ProductGrid";
import { ProductCardData } from "@/components/product/ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  discount: number;
  brand: string | null;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: { name: string | null; image: string | null };
  }[];
}

interface Props {
  product: Product;
  categorySlug: string;
  contact: {
    phone: string;
    phoneTel: string;
    whatsappUrl: string;
    telegramUrl: string;
    hawassaAddress: string;
  };
  related: ProductCardData[];
}

export default function ProductDetailClient({
  product,
  categorySlug,
  contact,
  related,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState(product.sizes[0] || "");
  const [color, setColor] = useState(product.colors[0] || "");
  const [tab, setTab] = useState<"description" | "specs">("description");
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const finalPrice = calcDiscountedPrice(product.price, product.discount);
  const images =
    product.images.length > 0
      ? product.images.map((img) =>
          resolveProductImageSrc(categorySlug, img)
        )
      : [resolveProductImageSrc(categorySlug, null)];
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      categorySlug,
      price: product.price,
      discount: product.discount,
      image: images[0],
      size: size || undefined,
      color: color || undefined,
    });
    toast.success("Added to cart!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-card mb-4">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-20 h-20 shrink-0 rounded border-2 overflow-hidden ${
                  selectedImage === i ? "border-gold" : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-heading text-3xl text-cream mb-2">{product.name}</h1>
          {product.brand && (
            <p className="text-cream/60 text-sm mb-4">Brand: {product.brand}</p>
          )}

          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(avgRating) ? "fill-gold text-gold" : "text-cream/20"
                }`}
              />
            ))}
            <span className="text-cream/60 text-sm">
              ({product.reviews.length} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-bold text-gold">
              {formatPrice(finalPrice)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-cream/40 line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge>-{product.discount}% OFF</Badge>
              </>
            )}
          </div>

          <p
            className={`text-sm mb-6 ${
              product.stock > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {product.stock > 0
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </p>

          {product.sizes.length > 0 && (
            <div className="mb-4">
              <label className="text-sm text-cream/70 block mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded border text-sm ${
                      size === s
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-gold/20 text-cream"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mb-6">
              <label className="text-sm text-cream/70 block mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-4 py-2 rounded border text-sm ${
                      color === c
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-gold/20 text-cream"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1"
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toggleItem({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  categorySlug,
                  price: product.price,
                  discount: product.discount,
                  image: images[0],
                });
                toast.success(
                  isInWishlist(product.id)
                    ? "Removed from wishlist"
                    : "Added to wishlist!"
                );
              }}
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist(product.id) ? "fill-gold text-gold" : ""
                }`}
              />
            </Button>
          </div>

          <div className="bg-card rounded-lg p-4 border border-gold/20 mb-8">
            <h3 className="font-heading text-gold mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5" /> Call to Order
            </h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2 text-cream/80">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                {contact.hawassaAddress}
              </p>
              <a
                href={`tel:${contact.phoneTel}`}
                className="text-gold hover:underline block"
              >
                {contact.phone}
              </a>
              <SocialLinks showPhone={false} />
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline text-sm"
                >
                  WhatsApp
                </a>
                <a
                  href={contact.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0088cc] hover:underline text-sm"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="border-b border-gold/20 mb-4">
            <div className="flex gap-4">
              {(["description", "specs"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-2 text-sm capitalize ${
                    tab === t
                      ? "text-gold border-b-2 border-gold"
                      : "text-cream/60"
                  }`}
                >
                  {t === "specs" ? "Specifications" : "Description"}
                </button>
              ))}
            </div>
          </div>
          {tab === "description" ? (
            <p className="text-cream/80 leading-relaxed">{product.description}</p>
          ) : (
            <ul className="text-cream/80 space-y-1 text-sm">
              <li>Brand: {product.brand || "Yzak Luxury Brand"}</li>
              <li>Sizes: {product.sizes.join(", ") || "N/A"}</li>
              <li>Colors: {product.colors.join(", ") || "N/A"}</li>
              <li>Stock: {product.stock} units</li>
            </ul>
          )}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-heading text-2xl text-gold mb-6">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-cream/60">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((r) => (
              <div
                key={r.id}
                className="bg-card rounded-lg p-4 border border-gold/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < r.rating ? "fill-gold text-gold" : "text-cream/20"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-cream/60">
                    {r.user.name || "Customer"}
                  </span>
                </div>
                {r.comment && <p className="text-cream/80">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl text-gold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
