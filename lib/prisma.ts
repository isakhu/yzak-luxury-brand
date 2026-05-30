import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (!process.env.DATABASE_URL) {
  const noopHandler: ProxyHandler<any> = {
    get() {
      return () =>
        Promise.reject(new Error("DATABASE_URL not set; Prisma unavailable"));
    },
  };

  prisma = new Proxy({}, noopHandler) as unknown as PrismaClient;
} else {
  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
}

export { prisma };
