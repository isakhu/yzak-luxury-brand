/** Category-specific product images — each category uses ONLY its own pool */

export const CATEGORY_IMAGES: Record<string, string[]> = {
  gold: [
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400",
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400",
    "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400",
    "https://images.unsplash.com/photo-1601121141418-e89fae8e0b7e?w=400",
  ],
  diamonds: [
    "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400",
    "https://images.unsplash.com/photo-1615655406736-b37892a30a40?w=400",
    "https://images.unsplash.com/photo-1596944924591-2a4a55df5e5b?w=400",
    "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=400",
  ],
  clothes: [
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400",
    "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400",
  ],
  shoes: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
  ],
  watches: [
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400",
    "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400",
  ],
  handbags: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=400",
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400",
    "https://images.unsplash.com/photo-1513094775335-0f042966b0a8?w=400",
  ],
};

/** Ethiopian city vibes — hero, about, contact, login backgrounds */
export const CITY_VIBE_IMAGES = [
  "https://images.unsplash.com/photo-1580746738099-b2d4b35b0b87?w=1200",
  "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1200",
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1200",
  "https://images.unsplash.com/photo-1609259814870-2f4ba34e1994?w=1200",
];

export const HERO_IMAGES = CITY_VIBE_IMAGES;

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

function getPool(categorySlug: string): string[] {
  return CATEGORY_IMAGES[categorySlug] ?? CATEGORY_IMAGES.gold;
}

export function getCategoryImage(categorySlug: string): string {
  return getPool(categorySlug)[0];
}

/** Product images for seed — strictly from this category's pool */
export function getProductImages(categorySlug: string, index: number): string[] {
  const pool = getPool(categorySlug);
  return [
    pool[index % pool.length],
    pool[(index + 1) % pool.length],
  ];
}

export function getSeedProductImages(categorySlug: string, index: number): string[] {
  return getProductImages(categorySlug, index);
}

/** Resolve DB value for next/image */
export function resolveProductImageSrc(
  categorySlug: string,
  image: string | undefined | null
): string {
  if (!image) return getCategoryImage(categorySlug);
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  if (image.startsWith("/")) return image;
  return getCategoryImage(categorySlug);
}

export function toLocalImagePath(
  categorySlug: string,
  filename: string
): string {
  const trimmed = filename.trim();
  if (!trimmed) return getCategoryImage(categorySlug);
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/images/")) return trimmed;
  if (trimmed.startsWith("images/")) return `/${trimmed}`;
  return getCategoryImage(categorySlug);
}

export function normalizeProductImages(
  categorySlug: string,
  images: string[]
): string[] {
  return images
    .map((img) => {
      const t = img.trim();
      if (!t) return "";
      if (t.startsWith("http")) return t;
      return toLocalImagePath(categorySlug, t);
    })
    .filter(Boolean);
}

export function toDisplayFilename(
  imagePath: string,
  categorySlug: string
): string {
  if (imagePath.startsWith("http")) return imagePath;
  const prefix = `/images/${categorySlug}/`;
  if (imagePath.startsWith(prefix)) {
    return imagePath.slice(prefix.length);
  }
  if (imagePath.includes("/")) {
    return imagePath.split("/").pop() || imagePath;
  }
  return imagePath;
}
