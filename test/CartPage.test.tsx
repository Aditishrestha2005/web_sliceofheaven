import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartPage from "../app/(protected)/cart/page";

// ---- mock next/link ----
jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

// ---- mock router ----
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// ---- mock pizzaImageUrl ----
jest.mock("@/lib/api/pizza", () => ({
  pizzaImageUrl: (img: string) => `http://img.test${img}`,
}));

// ---- mock cart context ----
const removeFromCartMock = jest.fn();
const increaseQuantityMock = jest.fn();
const decreaseQuantityMock = jest.fn();
const clearCartMock = jest.fn();

let cartState: any[] = [];
let totalItemsState = 0;
let totalAmountState = 0;

jest.mock("@/app/(protected)/context/CartContext", () => ({
  useCart: () => ({
    cart: cartState,
    removeFromCart: removeFromCartMock,
    increaseQuantity: increaseQuantityMock,
    decreaseQuantity: decreaseQuantityMock,
    clearCart: clearCartMock,
    totalItems: totalItemsState,
    totalAmount: totalAmountState,
  }),
}));

beforeEach(() => {
  pushMock.mockClear();
  removeFromCartMock.mockClear();
  increaseQuantityMock.mockClear();
  decreaseQuantityMock.mockClear();
  clearCartMock.mockClear();

  cartState = [];
  totalItemsState = 0;
  totalAmountState = 0;
});

test("renders empty cart state with Browse Menu link", () => {
  cartState = [];

  render(<CartPage />);

  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();

  const browse = screen.getByRole("link", { name: /browse menu/i });
  expect(browse).toHaveAttribute("href", "/dashboard");
});

test("renders cart items and summary", () => {
  cartState = [
    {
      pizzaId: "p1",
      name: "Margherita",
      price: 200,
      image: "/m.png",
      quantity: 2,
    },
  ];
  totalItemsState = 2;
  totalAmountState = 400;

  render(<CartPage />);

  expect(screen.getByText(/your cart/i)).toBeInTheDocument();
  expect(screen.getByText(/2 item\(s\) in cart/i)).toBeInTheDocument();

  expect(screen.getByText("Margherita")).toBeInTheDocument();
  expect(screen.getByText(/₹\s*200 each/i)).toBeInTheDocument();

  // 🔥 FIX: ₹400 appears twice (item total + summary total)
  const totals = screen.getAllByText(/₹\s*400/i);
  expect(totals).toHaveLength(2);

  expect(screen.getByText("Order Summary")).toBeInTheDocument();
});

test("clicking + calls increaseQuantity with pizzaId", async () => {
  const user = userEvent.setup();

  cartState = [
    { pizzaId: "p1", name: "Margherita", price: 200, image: "/m.png", quantity: 1 },
  ];
  totalItemsState = 1;
  totalAmountState = 200;

  render(<CartPage />);

  await user.click(screen.getByRole("button", { name: "+" }));
  expect(increaseQuantityMock).toHaveBeenCalledWith("p1");
});

test("clicking − calls decreaseQuantity with pizzaId", async () => {
  const user = userEvent.setup();

  cartState = [
    { pizzaId: "p1", name: "Margherita", price: 200, image: "/m.png", quantity: 1 },
  ];
  totalItemsState = 1;
  totalAmountState = 200;

  render(<CartPage />);

  await user.click(screen.getByRole("button", { name: "−" }));
  expect(decreaseQuantityMock).toHaveBeenCalledWith("p1");
});

test("clicking Remove calls removeFromCart", async () => {
  const user = userEvent.setup();

  cartState = [
    { pizzaId: "p1", name: "Margherita", price: 200, image: "/m.png", quantity: 1 },
  ];
  totalItemsState = 1;
  totalAmountState = 200;

  render(<CartPage />);

  await user.click(screen.getByRole("button", { name: /remove/i }));
  expect(removeFromCartMock).toHaveBeenCalledWith("p1");
});

test("clicking Clear Cart calls clearCart", async () => {
  const user = userEvent.setup();

  cartState = [
    { pizzaId: "p1", name: "Margherita", price: 200, image: "/m.png", quantity: 1 },
  ];
  totalItemsState = 1;
  totalAmountState = 200;

  render(<CartPage />);

  await user.click(screen.getByRole("button", { name: /clear cart/i }));
  expect(clearCartMock).toHaveBeenCalled();
});

test("Proceed to Checkout navigates to /checkout", async () => {
  const user = userEvent.setup();

  cartState = [
    { pizzaId: "p1", name: "Margherita", price: 200, image: "/m.png", quantity: 1 },
  ];
  totalItemsState = 1;
  totalAmountState = 200;

  render(<CartPage />);

  await user.click(screen.getByRole("button", { name: /proceed to checkout/i }));
  expect(pushMock).toHaveBeenCalledWith("/checkout");
});

test("image fallback sets src to /pizza.jpg on error", () => {
  cartState = [
    { pizzaId: "p1", name: "Margherita", price: 200, image: "/m.png", quantity: 1 },
  ];
  totalItemsState = 1;
  totalAmountState = 200;

  render(<CartPage />);

  const img = screen.getByRole("img", { name: /margherita/i }) as HTMLImageElement;
  img.dispatchEvent(new Event("error"));

  expect(img.getAttribute("src")).toBe("/pizza.jpg");
});