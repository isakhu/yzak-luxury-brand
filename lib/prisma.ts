import type { PrismaClient } from "@prisma/client";

// Simple in-memory mock of the Prisma client surface used by this project.
// Returns sensible defaults so the app can run without a database.

type AnyObj = Record<string, unknown>;

class MockModel {
  async findMany(): Promise<AnyObj[]> {
    return [];
  }
  async findUnique(): Promise<AnyObj | null> {
    return null;
  }
  async count(): Promise<number> {
    return 0;
  }
  async aggregate(): Promise<any> {
    return { _sum: { totalAmount: null } };
  }
  async create({ data }: { data: AnyObj }): Promise<AnyObj> {
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
  order: new MockModel(),
  product: new MockModel(),
  user: new MockModel(),
  siteSettings: new MockModel(),
  category: new MockModel(),
  contactMessage: new MockModel(),
  address: new MockModel(),
  orderItem: new MockModel(),
  review: new MockModel(),
  wishlistItem: new MockModel(),
  $connect: async () => {},
  $disconnect: async () => {},
} as unknown as PrismaClient;

export { mock as prisma };
