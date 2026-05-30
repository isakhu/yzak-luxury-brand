const CATEGORY_PRICE_RANGES: Record<string, { base: number; step: number; cycle: number }> = {
  gold: { base: 38000, step: 4200, cycle: 10 },
  diamonds: { base: 85000, step: 9500, cycle: 10 },
  clothes: { base: 2500, step: 650, cycle: 8 },
  shoes: { base: 3200, step: 850, cycle: 8 },
  watches: { base: 7000, step: 1800, cycle: 9 },
  handbags: { base: 4500, step: 1400, cycle: 8 },
  accessories: { base: 1200, step: 550, cycle: 7 },
};

export function getAverageMarketPrice(categorySlug: string, index: number): number {
  const range = CATEGORY_PRICE_RANGES[categorySlug] ?? CATEGORY_PRICE_RANGES.clothes;
  const position = index % range.cycle;
  const premiumBump = Math.floor(index / range.cycle) * Math.round(range.step * 0.35);

  return range.base + position * range.step + premiumBump;
}
