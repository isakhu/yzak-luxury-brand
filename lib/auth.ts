import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = "admin@yzak.com";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        // Demo mode: allow a fixed 4-digit demo password (0800).
        // If provided, return a demo admin user without querying a database.
        if (password === "0800") {
          return {
            id: "demo_admin",
            email: email ?? "admin@yzak.com",
            name: "Demo Admin",
            role: "ADMIN",
          } as any;
        }

        if (!email || !password || !/^\d{4}$/.test(password)) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const valid = await compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // Prefer DB-backed user data when available, but fall back to the
      // `user` object returned from `authorize` (demo mode) so tokens are
      // populated even without a database.
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        } else {
          token.id = (user as any).id ?? token.id;
          token.role = (user as any).role ?? token.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

export function getPostLoginPath(email: string): string {
  return email === ADMIN_EMAIL ? "/admin" : "/";
}
