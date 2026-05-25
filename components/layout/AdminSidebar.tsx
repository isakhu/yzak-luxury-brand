"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingBag,
  Users,
  Settings,
  Store,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-gold/20 shrink-0">
      <div className="p-4 border-b border-gold/20">
        <Link href="/admin" className="font-heading text-gold text-lg">
          YZAK Admin
        </Link>
      </div>
      <nav className="p-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-colors ${
                active
                  ? "bg-gold text-navy"
                  : "text-cream/80 hover:bg-gold/10 hover:text-gold"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md mt-4 text-cream/60 hover:text-gold transition-colors"
        >
          <Store className="w-5 h-5" />
          View Store
        </Link>
      </nav>
    </aside>
  );
}
