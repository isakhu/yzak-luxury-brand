"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { HERO_IMAGES } from "@/lib/images";

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {HERO_IMAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Yzak Luxury Brand — Ethiopia"
          fill
          className={`object-cover brightness-50 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
          sizes="100vw"
        />
      ))}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="font-heading text-4xl md:text-6xl text-cream mb-4 text-balance">
          Ethiopia&apos;s Premier Luxury Destination
        </h1>
        <p className="text-cream/80 mb-8 text-lg">
          Gold, diamonds, fashion & accessories — Hawassa, Turufat
        </p>
        <Link href="/products/gold">
          <Button size="lg">Shop Collection</Button>
        </Link>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === index ? "bg-gold" : "bg-cream/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
