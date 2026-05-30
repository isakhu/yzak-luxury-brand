import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { category: string; index: string } }
) {
  const label = `${params.category} ${params.index}`
    .replace(/[^a-z0-9 ]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
    <rect width="900" height="1200" fill="#1C2235"/>
    <rect x="90" y="90" width="720" height="1020" rx="36" fill="#C9A84C" opacity=".18"/>
    <text x="450" y="560" text-anchor="middle" fill="#F5F0E8" font-family="Arial, sans-serif" font-size="58" font-weight="700">Yzak</text>
    <text x="450" y="630" text-anchor="middle" fill="#F5F0E8" font-family="Arial, sans-serif" font-size="34">${label}</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
