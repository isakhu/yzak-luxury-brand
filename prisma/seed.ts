import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { getCategoryImage, getSeedProductImages } from "../lib/images";
import { CONTACT } from "../lib/contact";
import { getAverageMarketPrice } from "../lib/market-pricing";
import { getCatalogProductName } from "../lib/product-catalog";

const prisma = new PrismaClient();

const categories = [
  { name: "Gold", slug: "gold" },
  { name: "Diamonds", slug: "diamonds" },
  { name: "Clothes", slug: "clothes" },
  { name: "Shoes", slug: "shoes" },
  { name: "Watches", slug: "watches" },
  { name: "Handbags", slug: "handbags" },
  { name: "Accessories", slug: "accessories" },
];

const productCount = 8;

async function main() {
  const adminPin = await hash("1234", 10);

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {
      hawassaPhone: CONTACT.phone,
      hawassaAddress: CONTACT.hawassaAddress,
      whatsappNumber: CONTACT.phoneTel,
    },
    create: {
      id: "main",
      storeName: "Yzak Luxury Brand",
      hawassaPhone: CONTACT.phone,
      hawassaAddress: CONTACT.hawassaAddress,
      direDawaPhone: CONTACT.phone,
      direDawaAddress: "Dire Dawa, Ethiopia",
      whatsappNumber: CONTACT.phoneTel,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@yzak.com" },
    update: { role: "ADMIN", name: "Admin User", password: adminPin },
    create: {
      email: "admin@yzak.com",
      name: "Admin User",
      role: "ADMIN",
      password: adminPin,
    },
  });

  for (const cat of categories) {
    const categoryImage = getCategoryImage(cat.slug);

    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { image: categoryImage },
      create: {
        name: cat.name,
        slug: cat.slug,
        image: categoryImage,
      },
    });

    for (let i = 0; i < productCount; i++) {
      const name = getCatalogProductName(cat.slug, i);
      const slug = `${cat.slug}-${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}`;
      const price = getAverageMarketPrice(cat.slug, i);
      const images = getSeedProductImages(cat.slug, i);

      await prisma.product.upsert({
        where: { slug },
        update: {
          name,
          description: `${name} from Yzak Luxury Brand, priced for the Ethiopian market.`,
          price,
          brand: "Yzak Luxury Brand",
          images,
          status: "ACTIVE",
        },
        create: {
          name,
          description: `${name} from Yzak Luxury Brand, priced for the Ethiopian market.`,
          slug,
          price,
          discount: i % 3 === 0 ? 10 : 0,
          brand: "Yzak Luxury Brand",
          stock: Math.floor(Math.random() * 20) + 1,
          images,
          sizes: ["S", "M", "L", "XL"],
          colors: ["Gold", "Black", "White"],
          featured: i < 2,
          status: "ACTIVE",
          categoryId: category.id,
        },
      });
    }
  }

  console.log("Seed completed: 56 Yzak products with Ethiopian market prices");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
