"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/app/(protected)/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const linkClass = (href: string) =>
    [
      "text-sm font-semibold transition",
      isActive(href) ? "text-orange-600" : "text-orange-900",
      "hover:text-orange-600",
    ].join(" ");

  return (
    <header className="bg-[#fff7f0] border-b border-orange-100">
      <div className="w-full h-[72px] flex items-center">
        <div className="max-w-6xl w-full mx-auto px-4 flex items-center">
          <Link
            href="/home"
            className="text-3xl font-extrabold text-orange-600 whitespace-nowrap"
          >
            Slice of Heaven
          </Link>

          <nav className="hidden md:flex items-center gap-10 mx-auto">
            <Link className={linkClass("/home")} href="/home">
              Home
            </Link>
            <Link className={linkClass("/home")} href="/home">
              About
            </Link>
            <Link className={linkClass("/dashboard")} href="/dashboard">
              Menu
            </Link>
            <Link className={linkClass("/home")} href="/home">
              Contact
            </Link>
          </nav>
        </div>

        <div className="ml-auto pr-6 flex items-center gap-3">
          {/* Cart */}
          <button
            type="button"
            aria-label="Cart"
            className="relative w-11 h-11 rounded-full border border-orange-200 bg-white flex items-center justify-center hover:bg-orange-50 transition"
            onClick={() => router.push("/cart")}
          >
            {/* badge */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-600 text-white text-[11px] font-extrabold grid place-items-center">
                {totalItems}
              </span>
            )}

            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-orange-600">
              <path d="M6 6h15l-2 9H7L6 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M6 6 5 3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" stroke="currentColor" strokeWidth="2" />
              <path d="M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          {/* Profile */}
          <button
            type="button"
            aria-label="Profile"
            className="w-11 h-11 rounded-full border border-orange-200 bg-white overflow-hidden hover:ring-2 hover:ring-orange-300 transition"
            onClick={() => router.push("/user/profile")}
            title="Profile"
          >
            <Image
              src="/profile.png"
              alt="Profile"
              width={44}
              height={44}
              className="object-cover"
              priority
            />
          </button>
        </div>
      </div>
    </header>
  );
}
