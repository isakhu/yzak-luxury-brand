import Image from "next/image";

interface PageBackgroundProps {
  src: string;
  children: React.ReactNode;
  overlay?: "light" | "dark";
}

export default function PageBackground({
  src,
  children,
  overlay = "dark",
}: PageBackgroundProps) {
  return (
    <div className="relative min-h-[calc(100vh-200px)]">
      <Image
        src={src}
        alt=""
        fill
        className={`object-cover ${
          overlay === "dark" ? "brightness-[0.35]" : "brightness-50"
        }`}
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-navy/60" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
