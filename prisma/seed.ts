import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { getCategoryImage, getSeedProductImages } from "../lib/images";
import { CONTACT } from "../lib/contact";

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

const productNames: Record<string, string[]> = {
  gold: [
    "24K Gold Necklace",
    "Gold Bangle Set",
    "Royal Gold Ring",
    "Ethiopian Gold Earrings",
    "Heritage Gold Chain",
  ],
  diamonds: [
    "Diamond Solitaire Ring",
    "Brilliant Cut Pendant",
    "Diamond Stud Earrings",
    "Eternity Diamond Band",
    "Luxury Diamond Bracelet",
  ],
  clothes: [
    "Silk Evening Gown",
    "Designer Blazer",
    "Premium Cotton Shirt",
    "Luxury Kaftan",
    "Cashmere Wrap",
  ],
  shoes: [
    "Italian Leather Loafers",
    "Designer Heels",
    "Luxury Sneakers",
    "Suede Oxford Shoes",
    "Embellished Sandals",
  ],
  watches: [
    "Chronograph Gold Watch",
    "Diamond Bezel Watch",
    "Classic Dress Watch",
    "Sport Luxury Watch",
    "Limited Edition Timepiece",
  ],
  handbags: [
    "Quilted Leather Bag",
    "Croc-Embossed Tote",
    "Evening Clutch",
    "Designer Crossbody",
    "Signature Shoulder Bag",
  ],
  accessories: [
    "Silk Scarf Collection",
    "Gold Cufflinks",
    "Designer Sunglasses",
    "Leather Belt",
    "Pearl Brooch Set",
  ],
};

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

    const names = productNames[cat.slug] || [];

    for (let i = 0; i < names.length; i++) {
      const slug = `${cat.slug}-${names[i].toLowerCase().replace(/\s+/g, "-")}`;
      const price = Math.floor(Math.random() * 50000) + 5000;
      const images = getSeedProductImages(cat.slug, i);

      await prisma.product.upsert({
        where: { slug },
        update: {
          images,
          status: "ACTIVE",
        },
        create: {
          name: names[i],
          description: `Premium ${names[i]} from Yzak Luxury Brand. Crafted with exceptional quality for discerning customers in Ethiopia.`,
          slug,
          price,
          discount: i % 3 === 0 ? 10 : 0,
          brand: "Yzak",
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

  console.log("Seed completed: 35 products with category-specific Unsplash images");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
