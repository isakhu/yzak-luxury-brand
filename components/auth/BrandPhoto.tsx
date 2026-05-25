"use client";

import { useState } from "react";
import Image from "next/image";

export default function BrandPhoto() {
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden border-2 border-gold/40 bg-card">
      {/* Replace brand-photo.jpg in /public folder with your photo */}
      {!error ? (
        <Image
          src="/brand-photo.jpg"
          alt="Yzak Luxury Brand"
          fill
          className="object-cover"
          onError={() => setError(true)}
          priority
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-card to-navy">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gold/50 flex items-center justify-center mb-4">
            <span className="text-4xl text-gold/60">YZ</span>
          </div>
          <p className="text-cream/80 text-sm leading-relaxed">
            Add your photo here — replace{" "}
            <code className="text-gold text-xs">/public/brand-photo.jpg</code>
          </p>
        </div>
      )}
    </div>
  );
}
