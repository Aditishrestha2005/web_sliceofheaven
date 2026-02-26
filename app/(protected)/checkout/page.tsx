"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/(protected)/context/CartContext";
import { createOrder } from "@/lib/api/order";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalAmount, totalItems, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });

  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // COD only
  const paymentMethod = "COD";

  const canPlace = useMemo(() => {
    if (cart.length === 0) return false;
    if (!form.fullName.trim()) return false;
    if (!form.phone.trim()) return false;
    if (!form.address.trim()) return false;
    return true;
  }, [cart.length, form]);

  const placeOrder = async () => {
    if (!canPlace) {
      setToast("Please fill all required fields.");
      setTimeout(() => setToast(null), 2500);
      return;
    }

    try {
      setPlacing(true);

      await createOrder({
        items: cart.map((c) => ({
          pizzaId: c.pizzaId,
          name: c.name,
          price: c.price,
          image: c.image,
          quantity: c.quantity,
        })),
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        note: form.note.trim() || undefined,
        paymentMethod,
      });

      // ✅ Show success first
      setToast("Order placed successfully ✅");

      // ✅ Redirect first, then clear cart
      setTimeout(() => {
        clearCart();
        setToast(null);
        router.replace("/orders"); // replace avoids weird back navigation
      }, 1000);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to place order.";
      setToast(msg);
      setTimeout(() => setToast(null), 3500);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0 && !placing) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 text-center">
        <h1 className="text-3xl font-extrabold text-orange-800">Checkout</h1>
        <p className="mt-3 text-sm text-orange-900/60">
          Your cart is empty. Add pizzas before checkout.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-full bg-orange-600 px-6 py-3 text-sm font-extrabold text-white hover:opacity-90"
          type="button"
        >
          Go to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-orange-800">Checkout</h1>
          <p className="mt-1 text-sm text-orange-900/60">
            {totalItems} item(s) • Total ₹ {totalAmount}
          </p>
        </div>
      </div>

      {toast && (
        <div className="mt-6 rounded-2xl bg-orange-100 text-orange-800 px-4 py-3 text-sm font-bold">
          {toast}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Delivery Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-orange-800">
              Delivery Details
            </h2>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Full Name*"
                value={form.fullName}
                onChange={(v) => setForm((p) => ({ ...p, fullName: v }))}
                placeholder="Your name"
              />
              <Field
                label="Phone*"
                value={form.phone}
                onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
                placeholder="98XXXXXXXX"
              />

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-orange-900/80">
                  Address*
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className="mt-2 min-h-[120px] w-full rounded-2xl border border-orange-200 bg-orange-50/40 px-4 py-3 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Street, area, city..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-orange-900/80">
                  Note (optional)
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, note: e.target.value }))
                  }
                  className="mt-2 min-h-[90px] w-full rounded-2xl border border-orange-200 bg-orange-50/40 px-4 py-3 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Any instructions..."
                />
              </div>
            </div>
          </div>

          {/* Payment Method - COD */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-orange-800">
              Payment Method
            </h2>

            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/40 p-4">
              <p className="text-sm font-extrabold text-orange-900">
                Cash on Delivery (COD)
              </p>
              <p className="mt-1 text-xs text-orange-900/60">
                Pay in cash when your order arrives.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-orange-800">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.pizzaId}
                  className="flex justify-between text-sm text-orange-900/80"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-bold">
                    ₹ {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-orange-100 pt-4 flex justify-between text-sm">
              <span className="font-bold text-orange-900">Total</span>
              <span className="font-extrabold text-orange-900">
                ₹ {totalAmount}
              </span>
            </div>

            <button
              onClick={placeOrder}
              disabled={!canPlace || placing}
              className="mt-6 w-full rounded-full bg-orange-600 py-3 text-sm font-extrabold text-white hover:opacity-90 disabled:opacity-60"
              type="button"
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>

            <button
              onClick={() => router.push("/cart")}
              className="mt-3 w-full rounded-full border border-orange-200 bg-white py-3 text-sm font-bold text-orange-800 hover:bg-orange-50"
              type="button"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-orange-900/80">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-2xl border border-orange-200 bg-orange-50/40 px-4 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
        placeholder={placeholder}
      />
    </div>
  );
}