// test/AdminOrdersPage.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AdminOrdersPage from "../app/admin/orders/page";
import { getAllOrders, updateOrderStatus } from "@/lib/api/order";
import { pizzaImageUrl } from "@/lib/api/pizza";

jest.mock("@/lib/api/order", () => ({
  getAllOrders: jest.fn(),
  updateOrderStatus: jest.fn(),
}));

jest.mock("@/lib/api/pizza", () => ({
  pizzaImageUrl: jest.fn(),
}));

const ordersFixture = [
  {
    _id: "o1",
    fullName: "Rohan Sharma",
    phone: "9800000000",
    address: "Kathmandu",
    totalAmount: 800,
    status: "Pending",
    items: [{ name: "Margherita", price: 400, quantity: 2, image: "marg.jpg" }],
  },
  {
    _id: "o2",
    fullName: "Admin User",
    phone: "9811111111",
    address: "Lalitpur",
    totalAmount: 450,
    status: "Accepted",
    items: [{ name: "Pepperoni", price: 450, quantity: 1, image: "pep.jpg" }],
  },
];

describe("AdminOrdersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (pizzaImageUrl as jest.Mock).mockImplementation((img: string) => `/img/${img}`);
  });

  it("shows loading then renders orders list", async () => {
    (getAllOrders as jest.Mock).mockResolvedValueOnce(ordersFixture);

    render(<AdminOrdersPage />);

    expect(screen.getByText(/loading orders/i)).toBeInTheDocument();

    // Wait for heading (means loading finished)
    expect(await screen.findByRole("heading", { name: /orders/i })).toBeInTheDocument();

    // There are 2 orders
    expect(screen.getAllByText(/order id:/i)).toHaveLength(2);

    // IDs appear
    expect(screen.getByText("o1")).toBeInTheDocument();
    expect(screen.getByText("o2")).toBeInTheDocument();

    // Images helper called
    expect(pizzaImageUrl).toHaveBeenCalledWith("marg.jpg");
    expect(pizzaImageUrl).toHaveBeenCalledWith("pep.jpg");
  });

  it("shows empty state when no orders", async () => {
    (getAllOrders as jest.Mock).mockResolvedValueOnce([]);

    render(<AdminOrdersPage />);

    expect(await screen.findByText(/no orders found/i)).toBeInTheDocument();
  });

  it("updates order status when selecting a new status", async () => {
    const user = userEvent.setup();

    (getAllOrders as jest.Mock).mockResolvedValueOnce(ordersFixture);

    // when updating o1 -> Delivered
    (updateOrderStatus as jest.Mock).mockResolvedValueOnce({ status: "Delivered" });

    render(<AdminOrdersPage />);

    // wait until loaded
    await screen.findByText("o1");

    // ✅ one select per order
    const selects = await screen.findAllByRole("combobox");
    expect(selects).toHaveLength(2);

    // ✅ first select corresponds to first order in fixture (o1)
    await user.selectOptions(selects[0], "Delivered");

    expect(updateOrderStatus).toHaveBeenCalledWith("o1", "Delivered");

    // ✅ UI should show Delivered somewhere after state update
    await waitFor(() => {
      expect(screen.getAllByText("Delivered").length).toBeGreaterThan(0);
    });
  });

  it("handles getAllOrders error (stops loading)", async () => {
    (getAllOrders as jest.Mock).mockRejectedValueOnce(new Error("Boom"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<AdminOrdersPage />);

    expect(screen.getByText(/loading orders/i)).toBeInTheDocument();

    // loading should disappear even on error
    await waitFor(() => {
      expect(screen.queryByText(/loading orders/i)).not.toBeInTheDocument();
    });

    spy.mockRestore();
  });
});