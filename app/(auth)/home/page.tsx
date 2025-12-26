import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white p-10 rounded-lg shadow-md text-center w-full max-w-sm">
        
        <h1 className="text-3xl font-bold text-orange-600 mb-4">
          Slice of Heaven
        </h1>

        <p className="text-gray-600 mb-8">
          Welcome! Please log in or create an account to continue.
        </p>

        {/* BUTTONS */}
        <div className="space-y-6">
          
          {/* LOGIN */}
          <Link href="/login" className="block">
            <button className="w-full h-11 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600 transition">
              Log in
            </button>
          </Link>

          {/* REGISTER */}
          <Link href="/register" className="block">
            <button className="w-full h-11 rounded-md border border-orange-500 text-orange-500 font-semibold hover:bg-orange-50 transition">
              Register
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}
