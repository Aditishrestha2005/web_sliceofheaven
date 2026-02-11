"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
 
  const linkClass = (path: string) =>
    `px-4 py-2 rounded-lg font-semibold transition-colors ${
      pathname.startsWith(path)
        ? "bg-white text-orange-700"
        : "bg-white/15 hover:bg-white/25 text-white"
    }`;

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-amber-50 via-orange-50 to-red-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-orange-700 via-red-700 to-amber-700 text-white flex flex-col p-6 shadow-xl">
        <h2 className="text-2xl font-extrabold mb-10 tracking-wide drop-shadow">
          Slice of Heaven
        </h2>

        <nav className="flex flex-col gap-3">
          <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
            Dashboard
          </Link>

          <Link href="/admin/users" className={linkClass("/admin/users")}>
            Users
          </Link>

          {/* future-proof */}
          <Link href="/admin/orders" className={linkClass("/admin/orders")}>
            Orders
          </Link>

          <Link href="/admin/pizzas" className={linkClass("/admin/pizzas")}>
            Pizzas
          </Link>
        </nav>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
