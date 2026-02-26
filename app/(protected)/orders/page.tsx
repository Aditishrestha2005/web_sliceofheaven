"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyOrders, cancelMyOrder, Order, OrderStatus } from "@/lib/api/order";
import { pizzaImageUrl } from "@/lib/api/pizza";

function statusPill(status: OrderStatus) {
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Accepted":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Preparing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-orange-100 text-orange-800 border-orange-200";
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrMsg(null);
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      setErrMsg(
        err?.response?.data?.message || err?.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancelOrder = async (orderId: string) => {
    try {
      setCancellingId(orderId);
      setErrMsg(null);

      await cancelMyOrder(orderId);

      // reload list so status updates to Cancelled
      await load();
    } catch (err: any) {
      console.error(err);
      setErrMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to cancel order"
      );
    } finally {
      setCancellingId(null);
    }
  };

  const hasOrders = orders.length > 0;

  return (
    <div className="min-h-screen bg-[#fff7f0]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-800">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-orange-900/60">
              Track your order status here.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* ✅ Back button */}
            <button
              onClick={() => router.push("/user/profile")}
              className="rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-orange-800 hover:bg-orange-50"
              type="button"
            >
              ← Back
            </button>

            <Link
              href="/dashboard"
              className="rounded-full bg-orange-600 px-5 py-2 text-sm font-extrabold text-white hover:opacity-90"
            >
              Order More
            </Link>
          </div>
        </div>

        {loading && (
          <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-orange-900/60">
              Loading your orders...
            </p>
          </div>
        )}

        {!loading && errMsg && (
          <div className="mt-8 rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-red-600">{errMsg}</p>
          </div>
        )}

        {!loading && !errMsg && !hasOrders && (
          <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-10 shadow-sm text-center">
            <h2 className="text-xl font-extrabold text-orange-800">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-orange-900/60">
              Once you place an order, it will show up here.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-6 rounded-full bg-orange-600 px-6 py-3 text-sm font-extrabold text-white hover:opacity-90"
            >
              Browse Menu
            </Link>
          </div>
        )}

        {!loading && !errMsg && hasOrders && (
          <div className="mt-8 space-y-5">
            {orders.map((o) => (
              <div
                key={o._id}
                className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-extrabold text-orange-900">
                        Order ID:
                      </span>
                      <span className="text-xs font-mono text-orange-900/70 break-all">
                        {o._id}
                      </span>

                      <span
                        className={[
                          "ml-0 sm:ml-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold",
                          statusPill(o.status),
                        ].join(" ")}
                      >
                        {o.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-orange-900/70">
                      Total:{" "}
                      <span className="font-extrabold text-orange-900">
                        ₹ {o.totalAmount}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-orange-900/50">
                      Placed: {new Date(o.createdAt).toLocaleString()}
                    </p>

                    {/* ✅ Cancel button ONLY if Pending */}
                    {o.status === "Pending" && (
                      <button
                        onClick={() => cancelOrder(o._id)}
                        disabled={cancellingId === o._id}
                        className="mt-3 inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
                        type="button"
                      >
                        {cancellingId === o._id ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-orange-900/60">
                    <div>
                      <span className="font-bold">Deliver to:</span> {o.fullName}
                    </div>
                    <div>
                      <span className="font-bold">Phone:</span> {o.phone}
                    </div>
                    <div className="max-w-[420px]">
                      <span className="font-bold">Address:</span> {o.address}
                    </div>
                    {o.note && (
                      <div className="mt-1">
                        <span className="font-bold">Note:</span> {o.note}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="mt-5 rounded-2xl bg-orange-50 p-4">
                  <p className="text-sm font-extrabold text-orange-800">Items</p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {o.items.map((it, idx) => (
                      <div
                        key={`${it.pizzaId}-${idx}`}
                        className="flex items-center gap-4 rounded-2xl bg-white border border-orange-100 p-3"
                      >
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-orange-100 shrink-0">
                          <img
                            src={pizzaImageUrl(it.image)}
                            alt={it.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/pizza.jpg";
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-orange-900 truncate">
                            {it.name}
                          </p>
                          <p className="text-xs text-orange-900/60">
                            ₹ {it.price} × {it.quantity}
                          </p>
                        </div>

                        <div className="text-sm font-extrabold text-orange-900">
                          ₹ {it.price * it.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href="/dashboard"
                    className="text-xs font-bold text-orange-700 hover:underline"
                  >
                    Order again →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}