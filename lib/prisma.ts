import type { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { CATEGORY_IMAGES } from "./images";
import { getAverageMarketPrice } from "./market-pricing";
import { getCatalogProductName } from "./product-catalog";

type AnyObj = Record<string, unknown>;

// Derive demo categories from the image pools so images align with category
const demoCategories = Object.keys(CATEGORY_IMAGES).map((slug) => ({
  id: `cat-${slug}`,
  name: slug[0].toUpperCase() + slug.slice(1),
  slug,
}));

// Generate 40 demo products per category using the CATEGORY_IMAGES pools
const demoProducts: AnyObj[] = [];
const demoUsers: AnyObj[] = [
  {
    id: "demo-admin",
    email: "admin@yzak.com",
    name: "Admin User",
    password: hashSync("1234", 10),
    role: "ADMIN",
  },
];

for (const cat of demoCategories) {
  const pool = CATEGORY_IMAGES[cat.slug] ?? ["/images/placeholder.svg"];
  for (let i = 0; i < 40; i++) {
    demoProducts.push({
      id: `prod-${cat.slug}-${i + 1}`,
      name: getCatalogProductName(cat.slug, i),
      slug: `${cat.slug}-${getCatalogProductName(cat.slug, i)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}`,
      price: getAverageMarketPrice(cat.slug, i),
      discount: i % 5 === 0 ? 5 : 0,
      images: [pool[i % pool.length]],
      category: cat,
      reviews: Array.from({ length: (i % 5) + 1 }, () => ({ rating: 4 + (i % 2) })),
      createdAt: new Date().toISOString(),
      status: "ACTIVE",
    });
  }
}

class MockModel {
  modelName?: string;
  constructor(name?: string) {
    this.modelName = name;
  }

  async findMany(opts?: AnyObj): Promise<AnyObj[]> {
    if (this.modelName === "product") {
      const where = opts?.where as AnyObj | undefined;
      let list = demoProducts.slice();
      if (where?.status) list = list.filter((p) => p.status === where.status);
      if (where?.categoryId) {
        list = list.filter((p) => {
          const category = p.category as { id?: string } | undefined;
          return category?.id === where.categoryId;
        });
      }
      if (where?.name && (where.name as any).contains) {
        const q = String((where.name as any).contains).toLowerCase();
        list = list.filter((p) => String(p.name).toLowerCase().includes(q));
      }
      return list as AnyObj[];
    }
    if (this.modelName === "category") return demoCategories as AnyObj[];
    if (this.modelName === "user") {
      const where = opts?.where as AnyObj | undefined;
      let list = demoUsers.slice();
      if (where?.role) list = list.filter((u) => u.role === where.role);
      return list as AnyObj[];
    }
    return [];
  }

  async findUnique(opts?: AnyObj): Promise<AnyObj | null> {
    if (this.modelName === "category") {
      const where = opts?.where as AnyObj | undefined;
      if (where?.slug) return demoCategories.find((c) => c.slug === where.slug) ?? null;
      if (where?.id) return demoCategories.find((c) => c.id === where.id) ?? null;
    }
    if (this.modelName === "user") {
      const where = opts?.where as AnyObj | undefined;
      if (where?.email) return demoUsers.find((u) => u.email === where.email) ?? null;
      if (where?.id) return demoUsers.find((u) => u.id === where.id) ?? null;
    }
    return null;
  }

  async count(opts?: AnyObj): Promise<number> {
    if (this.modelName === "product") return demoProducts.length;
    if (this.modelName === "user") {
      const where = opts?.where as AnyObj | undefined;
      if (where?.role) return demoUsers.filter((u) => u.role === where.role).length;
      return demoUsers.length;
    }
    return 0;
  }

  async aggregate(): Promise<any> {
    return { _sum: { totalAmount: null } };
  }

  async create({ data }: { data: AnyObj }): Promise<AnyObj> {
    if (this.modelName === "user") {
      const user = { ...data, id: `user-${demoUsers.length + 1}` };
      demoUsers.push(user);
      return user;
    }

    return { ...data, id: "mock-id" };
  }

  async update({ where, data }: { where?: AnyObj; data: AnyObj }): Promise<AnyObj> {
    return { ...(where ?? {}), ...data };
  }

  async upsert({ where, create, update }: { where?: AnyObj; create?: AnyObj; update?: AnyObj }): Promise<AnyObj> {
    return create ?? update ?? { ...(where ?? {}) };
  }

  async delete(): Promise<any> {
    return {};
  }
}

const mock = {
  order: new MockModel("order"),
  product: new MockModel("product"),
  user: new MockModel("user"),
  siteSettings: new MockModel("siteSettings"),
  category: new MockModel("category"),
  contactMessage: new MockModel("contactMessage"),
  address: new MockModel("address"),
  orderItem: new MockModel("orderItem"),
  review: new MockModel("review"),
  wishlistItem: new MockModel("wishlistItem"),
  $connect: async () => {},
  $disconnect: async () => {},
} as unknown as PrismaClient;

export { mock as prisma };
