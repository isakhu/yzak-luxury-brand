export const PRODUCT_NAMES: Record<string, string[]> = {
  gold: [
    "21 Carat Gold Necklace",
    "22 Carat Gold Bangle Set",
    "18 Carat Gold Ring",
    "21 Carat Gold Earrings",
    "22 Carat Gold Chain",
    "18 Carat Gold Bracelet",
    "21 Carat Wedding Band",
    "22 Carat Gold Pendant",
  ],
  diamonds: [
    "Diamond Solitaire Ring",
    "Brilliant Cut Diamond Pendant",
    "Diamond Stud Earrings",
    "Diamond Tennis Bracelet",
    "Princess Cut Diamond Band",
    "Diamond Halo Necklace",
    "Pear Diamond Drop Earrings",
    "Emerald Cut Diamond Ring",
  ],
  clothes: [
    "Zara Satin Evening Dress",
    "H&M Premium Blazer",
    "Gucci Inspired Silk Shirt",
    "Calvin Klein Cotton Shirt",
    "Ralph Lauren Polo",
    "Tommy Hilfiger Knitwear",
    "Mango Tailored Trousers",
    "Yzak Habesha Luxury Wear",
  ],
  shoes: [
    "Nike Air Max Sneakers",
    "Adidas Ultraboost Shoes",
    "Puma Suede Classic",
    "Clarks Leather Loafers",
    "Gucci Inspired Heels",
    "Converse Chuck Taylor",
    "Reebok Classic Leather",
    "Timberland Premium Boots",
  ],
  watches: [
    "Rolex Inspired Gold Watch",
    "Casio Edifice Chronograph",
    "Seiko Automatic Watch",
    "Fossil Grant Leather Watch",
    "Tissot Classic Dress Watch",
    "Citizen Eco-Drive Watch",
    "Michael Kors Parker Watch",
    "Omega Inspired Timepiece",
  ],
  handbags: [
    "Louis Vuitton Inspired Tote",
    "Gucci Inspired Crossbody",
    "Michael Kors Shoulder Bag",
    "Coach Leather Satchel",
    "Chanel Inspired Quilted Bag",
    "Prada Inspired Handbag",
    "Kate Spade Mini Bag",
    "Yzak Leather Evening Clutch",
  ],
  accessories: [
    "Ray-Ban Inspired Sunglasses",
    "Hermes Inspired Silk Scarf",
    "Montblanc Style Cufflinks",
    "Yzak Leather Belt",
    "Pearl Brooch Set",
    "Gold Plated Bracelet",
    "Designer Wallet",
    "Luxury Perfume Gift Set",
  ],
};

export function getCatalogProductName(categorySlug: string, index: number): string {
  const names = PRODUCT_NAMES[categorySlug] ?? PRODUCT_NAMES.accessories;
  const baseName = names[index % names.length];
  const round = Math.floor(index / names.length);

  return round === 0 ? baseName : `${baseName} ${round + 1}`;
}
