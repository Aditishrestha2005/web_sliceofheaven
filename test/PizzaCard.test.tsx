import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PizzaCard from "../app/(protected)/dashboard/_components/PizzaCard";

// ---- mock router ----
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// ---- mock pizza helpers ----
jest.mock("@/lib/api/pizza", () => ({
  pizzaImageUrl: (img: string) => `http://test/${img}`,
}));

// ---- mock cart context ----
const toggleCartMock = jest.fn();
const isInCartMock = jest.fn();

jest.mock("@/app/(protected)/context/CartContext", () => ({
  useCart: () => ({
    toggleCart: toggleCartMock,
    isInCart: isInCartMock,
  }),
}));

beforeEach(() => {
  pushMock.mockClear();
  toggleCartMock.mockClear();
  isInCartMock.mockClear();
});

const pizza = {
  _id: "p1",
  name: "Margherita",
  description: "Classic cheese",
  price: 250,
  image: "/img.png",
  category: "Veg",
};

test("renders pizza info", () => {
  isInCartMock.mockReturnValue(false);

  render(<PizzaCard pizza={pizza as any} />);

  expect(screen.getByText("Margherita")).toBeInTheDocument();
  expect(screen.getByText("Classic cheese")).toBeInTheDocument();
  expect(screen.getByText(/₹\s*250/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /order now/i })).toBeInTheDocument();

  const img = screen.getByRole("img", { name: /margherita/i }) as HTMLImageElement;
  expect(img.src).toContain("http://test//img.png");
});

test("shows 'Cart' when not in cart and toggles add", async () => {
  const user = userEvent.setup();
  isInCartMock.mockReturnValue(false);

  render(<PizzaCard pizza={pizza as any} />);

  expect(screen.getByText("Cart")).toBeInTheDocument();
  expect(screen.getByLabelText(/add to cart/i)).toBeInTheDocument();

  await user.click(screen.getByLabelText(/add to cart/i));

  expect(toggleCartMock).toHaveBeenCalledWith({
    pizzaId: "p1",
    name: "Margherita",
    price: 250,
    image: "/img.png",
  });
});

test("shows 'In Cart' when in cart and toggles remove", async () => {
  const user = userEvent.setup();
  isInCartMock.mockReturnValue(true);

  render(<PizzaCard pizza={pizza as any} />);

  expect(screen.getByText("In Cart")).toBeInTheDocument();
  expect(screen.getByLabelText(/remove from cart/i)).toBeInTheDocument();

  await user.click(screen.getByLabelText(/remove from cart/i));

  expect(toggleCartMock).toHaveBeenCalledWith({
    pizzaId: "p1",
    name: "Margherita",
    price: 250,
    image: "/img.png",
  });
});

test("Order Now adds to cart if not already and navigates to /checkout", async () => {
  const user = userEvent.setup();
  isInCartMock.mockReturnValue(false);

  render(<PizzaCard pizza={pizza as any} />);

  await user.click(screen.getByRole("button", { name: /order now/i }));

  // should add to cart first
  expect(toggleCartMock).toHaveBeenCalledWith({
    pizzaId: "p1",
    name: "Margherita",
    price: 250,
    image: "/img.png",
  });

  expect(pushMock).toHaveBeenCalledWith("/checkout");
});

test("Order Now does NOT add to cart if already in cart, only navigates", async () => {
  const user = userEvent.setup();
  isInCartMock.mockReturnValue(true);

  render(<PizzaCard pizza={pizza as any} />);

  await user.click(screen.getByRole("button", { name: /order now/i }));

  expect(toggleCartMock).not.toHaveBeenCalled();
  expect(pushMock).toHaveBeenCalledWith("/checkout");
});

test("image fallback sets src to /pizza.jpg on error", () => {
  isInCartMock.mockReturnValue(false);

  render(<PizzaCard pizza={pizza as any} />);

  const img = screen.getByRole("img", { name: /margherita/i }) as HTMLImageElement;

  // trigger error
  img.dispatchEvent(new Event("error"));

  expect(img.getAttribute("src")).toBe("/pizza.jpg");
});