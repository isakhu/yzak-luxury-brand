import Image from "next/image";
import { CITY_VIBE_IMAGES } from "@/lib/images";

interface CityVibeBackgroundProps {
  children: React.ReactNode;
  imageIndex?: number;
  overlayClassName?: string;
  className?: string;
}

export default function CityVibeBackground({
  children,
  imageIndex = 0,
  overlayClassName = "bg-navy/85",
  className = "min-h-screen",
}: CityVibeBackgroundProps) {
  const src = CITY_VIBE_IMAGES[imageIndex % CITY_VIBE_IMAGES.length];

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority={imageIndex === 0}
      />
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
