import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (req.auth.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: ["/", "/admin/:path*"],
};
