"use client";

import { useEffect, useMemo, useState } from "react";
import PizzaCard from "./PizzaCard";
import Navbar from "./Navbar";
import { getAllPizzas, Pizza, PizzaCategory } from "@/lib/api/pizza";

const TABS: PizzaCategory[] = ["All", "Veg", "Non-Veg"];

export default function PizzaMenu() {
  const [tab, setTab] = useState<PizzaCategory>("All");
  const [query, setQuery] = useState("");
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pizzas
      .filter((p) => (tab === "All" ? true : p.category === tab))
      .filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      });
  }, [pizzas, tab, query]);

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-10 pb-12">
        {/* search */}
        <div className="flex justify-center">
          <div className="w-full md:w-[860px] bg-white border border-orange-100 rounded-full px-6 py-3 flex items-center gap-3 shadow-sm">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your pizza..."
              className="bg-transparent outline-none w-full text-sm text-orange-950 placeholder:text-orange-300"
            />
            <span className="text-orange-400">🔍</span>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6 flex justify-center gap-2">
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "text-xs px-5 py-2 rounded-full border transition",
                  active
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-orange-900/70 border-orange-100 hover:bg-orange-100",
                ].join(" ")}
                type="button"
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* grid */}
        <div className="mt-10">
          {loading ? (
            <p className="text-center text-sm text-orange-900/60">
              Loading pizzas...
            </p>
          ) : error ? (
            <p className="text-center text-sm text-red-600">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-orange-900/60">
              No pizzas found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
              {filtered.map((pizza) => (
                <PizzaCard key={pizza._id} pizza={pizza} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
