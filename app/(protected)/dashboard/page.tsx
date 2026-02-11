import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-4 border-b border-orange-200 bg-white/70 backdrop-blur">
        {/* Logo / Brand */}
        <h1 className="text-2xl font-extrabold text-orange-600 tracking-wide">
          Slice of Heaven
        </h1>

        {/* Nav links */}
        <nav className="flex gap-14 text-sm font-semibold text-orange-700">
          <Link href="/dashboard" className="hover:underline">
            Home
          </Link>
          <a href="#about" className="hover:underline">
            About us
          </a>
          <a href="#menu" className="hover:underline">
            Menu
          </a>
          <a href="#contact" className="hover:underline">
            Contact
          </a>
        </nav>

        {/* ✅ Profile avatar → /user/profile */}
        <Link href="/user/profile" className="flex items-center gap-3">
          <Image
            src="/profile.png"
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-orange-500"
            priority
          />
        </Link>
      </header>

      {/* Main content */}
      <main className="p-10">
        <h2 className="text-2xl font-bold text-orange-700">
          Welcome to Slice of Heaven 🍕
        </h2>
        <p className="mt-2 text-orange-900/70">
          Explore our menu, place an order, and track your favorites.
        </p>
      </main>
    </div>
  );
}
