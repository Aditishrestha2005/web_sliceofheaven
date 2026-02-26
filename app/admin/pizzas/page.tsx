"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { deletePizza, getAllPizzas, Pizza, pizzaImageUrl } from "@/lib/api/pizza";

export default function AdminPizzasPage() {
  const searchParams = useSearchParams();

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("created") === "1") {
      setToast("Pizza created successfully ✅");
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPizzas();
      setPizzas(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load pizzas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: string) => {
    const ok = window.confirm("Delete this pizza?");
    if (!ok) return;

    try {
      setBusyId(id);
      await deletePizza(id);
      setPizzas((prev) => prev.filter((p) => p._id !== id));
    } catch (e: any) {
      alert(e?.message || "Failed to delete pizza");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-w-0">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-orange-800">Pizzas</h1>
          <p className="mt-1 text-sm text-orange-900/60">
            Manage pizza items (view, add, delete).
          </p>
        </div>

        <div className="flex gap-3">
       

          <Link
            href="/admin/pizzas/create"
            className="rounded-full bg-orange-600 px-5 py-2 text-sm font-extrabold text-white hover:opacity-90"
          >
            + Add Pizza
          </Link>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="mt-5 rounded-2xl bg-green-100 text-green-700 px-4 py-3 text-sm font-semibold">
          {toast}
        </div>
      )}

      {/* States */}
      {loading ? (
        <p className="mt-8 text-sm text-orange-900/60">Loading pizzas...</p>
      ) : error ? (
        <p className="mt-8 text-sm text-red-600">{error}</p>
      ) : pizzas.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-8">
          <p className="text-sm text-orange-900/70">No pizzas found.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map((pizza) => (
            <div
              key={pizza._id}
              className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-orange-700/70">
                    {pizza.category}
                  </p>
                  <h3 className="mt-1 font-extrabold text-orange-900 truncate">
                    {pizza.name}
                  </h3>
                </div>

                <button
                  onClick={() => onDelete(pizza._id)}
                  disabled={busyId === pizza._id}
                  className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  type="button"
                >
                  {busyId === pizza._id ? "Deleting..." : "Delete"}
                </button>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-orange-50 overflow-hidden flex items-center justify-center">
                  {/* ✅ using <img> so remote images work */}
                  <img
                    src={pizzaImageUrl(pizza.image)}
                    alt={pizza.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/pizza.jpg";
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-orange-900/60 line-clamp-2">
                    {pizza.description}
                  </p>
                  <p className="mt-2 text-sm font-extrabold text-orange-900">
                    ₹ {pizza.price}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-orange-50 px-4 py-3">
                <p className="text-xs text-orange-900/70">
                  ID: <span className="font-mono">{pizza._id}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
