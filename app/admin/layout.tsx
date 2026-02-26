"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const linkClass = (path: string) =>
    `group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition
     ${
       isActive(path)
         ? "bg-orange-600 text-white shadow-sm"
         : "text-orange-900/80 hover:bg-orange-50"
     }`;

  return (
    <div className="min-h-screen w-full bg-orange-50">
      {/* ✅ FULL WIDTH container (no max-w / no mx-auto) */}
      <div className="flex w-full min-w-0">
        {/* Sidebar */}
        <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-orange-100 bg-white">
          <div className="p-6">
            <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4">
              <h2 className="text-xl font-extrabold text-orange-700 leading-tight">
                Slice of Heaven
              </h2>
              <p className="mt-1 text-xs text-orange-900/60">Admin Panel</p>
            </div>
          </div>

          <nav className="px-4 pb-6 space-y-2">
            <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
              <span>Dashboard</span>
              <span className="text-xs opacity-70 group-hover:opacity-100">→</span>
            </Link>

            <Link href="/admin/users" className={linkClass("/admin/users")}>
              <span>Users</span>
              <span className="text-xs opacity-70 group-hover:opacity-100">→</span>
            </Link>

            <Link href="/admin/orders" className={linkClass("/admin/orders")}>
              <span>Orders</span>
              <span className="text-xs opacity-70 group-hover:opacity-100">→</span>
            </Link>

            <Link href="/admin/pizzas" className={linkClass("/admin/pizzas")}>
              <span>Pizzas</span>
              <span className="text-xs opacity-70 group-hover:opacity-100">→</span>
            </Link>
          </nav>

          <div className="mt-auto p-6">
            <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-800">Tip</p>
              <p className="mt-1 text-xs text-orange-900/60">
                Use <span className="font-semibold">Users</span> page for full CRUD.
                Dashboard is overview only.
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="md:hidden sticky top-0 z-40 border-b border-orange-100 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-extrabold text-orange-700">
                  Slice of Heaven
                </p>
                <p className="text-[11px] text-orange-900/60">Admin Panel</p>
              </div>

              <Link
                href="/admin/users"
                className="rounded-xl bg-orange-600 px-3 py-2 text-xs font-semibold text-white"
              >
                Users
              </Link>
            </div>
          </div>

          {/* ✅ Keep content centered, but sidebar stays full-left */}
          <main className="min-w-0 flex-1 py-8">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
