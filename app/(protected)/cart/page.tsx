"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/(protected)/context/CartContext";
import { pizzaImageUrl } from "@/lib/api/pizza";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalAmount,
    totalItems,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fff7f0] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-extrabold text-orange-800">
          Your Cart is Empty
        </h1>
        <p className="mt-2 text-sm text-orange-900/60">
          Add pizzas from the menu and they’ll appear here.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 rounded-full bg-orange-600 px-6 py-3 text-sm font-extrabold text-white hover:opacity-90"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7f0]">
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-800">
              Your Cart
            </h1>
            <p className="mt-1 text-sm text-orange-900/60">
              {totalItems} item(s) in cart
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-sm font-bold text-red-600 hover:underline self-start sm:self-auto"
            type="button"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items */}
          <div className="lg:col-span-8 space-y-5">
            {cart.map((item) => (
              <div
                key={item.pizzaId}
                className="flex items-center gap-5 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"
              >
                {/* Image */}
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-orange-50 flex items-center justify-center shrink-0">
                  <img
                    src={pizzaImageUrl(item.image)}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/pizza.jpg";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-extrabold text-orange-900 truncate">
                    {item.name}
                  </h2>
                  <p className="text-sm text-orange-900/60">
                    ₹ {item.price} each
                  </p>

                  <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-orange-200 bg-orange-50 px-3 py-2">
                    <button
                      onClick={() => decreaseQuantity(item.pizzaId)}
                      className="w-8 h-8 rounded-full bg-white border border-orange-200 text-orange-700 font-extrabold hover:bg-orange-100"
                      type="button"
                    >
                      −
                    </button>

                    <span className="text-sm font-extrabold text-orange-900 w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.pizzaId)}
                      className="w-8 h-8 rounded-full bg-white border border-orange-200 text-orange-700 font-extrabold hover:bg-orange-100"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-3">
                  <p className="font-extrabold text-orange-900">
                    ₹ {item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.pizzaId)}
                    className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-orange-800">
                Order Summary
              </h2>

              <div className="mt-6 space-y-3 text-sm text-orange-900/80">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span className="font-bold">{totalItems}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-extrabold text-orange-900">
                    ₹ {totalAmount}
                  </span>
                </div>
              </div>

              <button
                className="mt-6 w-full rounded-full bg-orange-600 py-3 text-sm font-extrabold text-white hover:opacity-90"
                onClick={() => router.push("/checkout")}
                type="button"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/dashboard"
                className="mt-3 block text-center text-xs font-bold text-orange-700 hover:underline"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
