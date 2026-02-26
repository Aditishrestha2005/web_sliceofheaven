import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "../app/(protected)/context/CartContext";

function Tester() {
  const {
    cart,
    addToCart,
    removeFromCart,
    toggleCart,
    increaseQuantity,
    decreaseQuantity,
    isInCart,
    clearCart,
    totalItems,
    totalAmount,
  } = useCart();

  return (
    <div>
      <div data-testid="totalItems">{totalItems}</div>
      <div data-testid="totalAmount">{totalAmount}</div>
      <div data-testid="cartCount">{cart.length}</div>
      <div data-testid="inCart">{isInCart("p1") ? "yes" : "no"}</div>
      <div data-testid="qtyP1">{cart.find((c) => c.pizzaId === "p1")?.quantity ?? 0}</div>

      <button
        onClick={() =>
          addToCart({ pizzaId: "p1", name: "Margherita", price: 100, image: "/a.png" })
        }
      >
        add
      </button>

      <button
        onClick={() =>
          toggleCart({ pizzaId: "p1", name: "Margherita", price: 100, image: "/a.png" })
        }
      >
        toggle
      </button>

      <button onClick={() => removeFromCart("p1")}>remove</button>
      <button onClick={() => increaseQuantity("p1")}>inc</button>
      <button onClick={() => decreaseQuantity("p1")}>dec</button>
      <button onClick={() => clearCart()}>clear</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <CartProvider>
      <Tester />
    </CartProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

test("loads cart from localStorage on mount", async () => {
  localStorage.setItem(
    "sliceofheaven_cart_v1",
    JSON.stringify([
      {
        pizzaId: "p1",
        name: "Margherita",
        price: 100,
        image: "/a.png",
        quantity: 2,
      },
    ])
  );

  renderWithProvider();

  expect(screen.getByTestId("cartCount").textContent).toBe("1");
  expect(screen.getByTestId("qtyP1").textContent).toBe("2");
  expect(screen.getByTestId("totalItems").textContent).toBe("2");
  expect(screen.getByTestId("totalAmount").textContent).toBe("200");
});

test("addToCart adds item and increments quantity if already exists", async () => {
  const user = userEvent.setup();
  renderWithProvider();

  await user.click(screen.getByText("add"));
  expect(screen.getByTestId("cartCount").textContent).toBe("1");
  expect(screen.getByTestId("qtyP1").textContent).toBe("1");

  await user.click(screen.getByText("add"));
  expect(screen.getByTestId("qtyP1").textContent).toBe("2");
  expect(screen.getByTestId("totalItems").textContent).toBe("2");
  expect(screen.getByTestId("totalAmount").textContent).toBe("200");
});

test("removeFromCart removes item", async () => {
  const user = userEvent.setup();
  renderWithProvider();

  await user.click(screen.getByText("add"));
  expect(screen.getByTestId("cartCount").textContent).toBe("1");

  await user.click(screen.getByText("remove"));
  expect(screen.getByTestId("cartCount").textContent).toBe("0");
  expect(screen.getByTestId("qtyP1").textContent).toBe("0");
});

test("toggleCart adds when not in cart and removes when in cart", async () => {
  const user = userEvent.setup();
  renderWithProvider();

  expect(screen.getByTestId("inCart").textContent).toBe("no");

  await user.click(screen.getByText("toggle"));
  expect(screen.getByTestId("inCart").textContent).toBe("yes");
  expect(screen.getByTestId("qtyP1").textContent).toBe("1");

  await user.click(screen.getByText("toggle"));
  expect(screen.getByTestId("inCart").textContent).toBe("no");
  expect(screen.getByTestId("cartCount").textContent).toBe("0");
});

test("increaseQuantity and decreaseQuantity works; decreases to 0 removes item", async () => {
  const user = userEvent.setup();
  renderWithProvider();

  await user.click(screen.getByText("add")); // qty 1
  await user.click(screen.getByText("inc")); // qty 2
  expect(screen.getByTestId("qtyP1").textContent).toBe("2");

  await user.click(screen.getByText("dec")); // qty 1
  expect(screen.getByTestId("qtyP1").textContent).toBe("1");

  await user.click(screen.getByText("dec")); // qty 0 -> removed
  expect(screen.getByTestId("cartCount").textContent).toBe("0");
  expect(screen.getByTestId("qtyP1").textContent).toBe("0");
});

test("clearCart empties cart and resets totals", async () => {
  const user = userEvent.setup();
  renderWithProvider();

  await user.click(screen.getByText("add"));
  await user.click(screen.getByText("add"));

  expect(screen.getByTestId("totalItems").textContent).toBe("2");
  expect(screen.getByTestId("totalAmount").textContent).toBe("200");

  await user.click(screen.getByText("clear"));

  expect(screen.getByTestId("cartCount").textContent).toBe("0");
  expect(screen.getByTestId("totalItems").textContent).toBe("0");
  expect(screen.getByTestId("totalAmount").textContent).toBe("0");
});

test("persists cart to localStorage on changes", async () => {
  const user = userEvent.setup();
  const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

  renderWithProvider();

  await user.click(screen.getByText("add"));

  // called by persist effect
  expect(setItemSpy).toHaveBeenCalled();
  expect(localStorage.getItem("sliceofheaven_cart_v1")).toContain('"pizzaId":"p1"');
});

test("useCart throws if used outside CartProvider", () => {
  function Bad() {
    useCart();
    return null;
  }

  // suppress react error output for this test only
  const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  expect(() => render(<Bad />)).toThrow(/useCart must be used within CartProvider/i);

  errSpy.mockRestore();
});