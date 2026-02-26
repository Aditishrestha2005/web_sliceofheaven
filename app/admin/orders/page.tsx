"use client";

import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  Order,
  OrderStatus,
} from "@/lib/api/order";
import { pizzaImageUrl } from "@/lib/api/pizza";

function statusColor(status: OrderStatus) {
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-800";
    case "Accepted":
      return "bg-amber-100 text-amber-800";
    case "Preparing":
      return "bg-yellow-100 text-yellow-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-orange-100 text-orange-800";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    status: OrderStatus
  ) => {
    try {
      const updated = await updateOrderStatus(orderId, status);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: updated.status } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-orange-700 font-semibold">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-orange-700">
        Orders
      </h1>

      {orders.length === 0 && (
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <p className="text-orange-700">No orders found.</p>
        </div>
      )}

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-5"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <p className="text-sm text-orange-900/70">
                Order ID:{" "}
                <span className="font-mono">{order._id}</span>
              </p>

              <p className="text-sm text-orange-900/70 mt-1">
                Customer:{" "}
                <span className="font-bold">
                  {order.fullName}
                </span>
              </p>

              <p className="text-sm text-orange-900/70">
                Phone: {order.phone}
              </p>

              <p className="text-sm text-orange-900/70">
                Address: {order.address}
              </p>

              <p className="text-sm text-orange-900/70 mt-2">
                Total:{" "}
                <span className="font-extrabold text-orange-900">
                  ₹ {order.totalAmount}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span
                className={`px-4 py-2 rounded-full text-xs font-bold ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>

              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(
                    order._id,
                    e.target.value as OrderStatus
                  )
                }
                className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Preparing">Preparing</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-orange-50 p-3 rounded-2xl"
              >
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-white">
                  <img
                    src={pizzaImageUrl(item.image)}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-bold text-orange-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-orange-800">
                    ₹ {item.price} × {item.quantity}
                  </p>
                </div>

                <p className="font-extrabold text-orange-900">
                  ₹ {item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
