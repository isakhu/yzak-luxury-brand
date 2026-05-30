"use client";

import { useState } from "react";
import Image from "next/image";

export default function BrandPhoto() {
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden border-2 border-gold/40 bg-card">
      {/* Render the brand photo; if it fails, show a minimal neutral fallback. */}
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-card to-navy">
          {/* Minimal fallback: initials only, no instructional text */}
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-3xl text-gold">YZ</div>
        </div>
      )}
    </div>
  );
}
