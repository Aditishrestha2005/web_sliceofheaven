import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PizzaMenu from "../app/(protected)/dashboard/_components/PizzaMenu";

// ---- Mock Navbar ----
jest.mock("../app/(protected)/dashboard/_components/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

// ---- Mock PizzaCard ----
jest.mock("../app/(protected)/dashboard/_components/PizzaCard", () => {
  return function MockPizzaCard({ pizza }: any) {
    return <div data-testid="pizza-card">{pizza.name}</div>;
  };
});

// ---- Mock API ----
const getAllPizzasMock = jest.fn();

jest.mock("@/lib/api/pizza", () => ({
  getAllPizzas: () => getAllPizzasMock(),
}));

beforeEach(() => {
  getAllPizzasMock.mockClear();
});

const samplePizzas = [
  {
    _id: "1",
    name: "Margherita",
    description: "Classic cheese pizza",
    category: "Veg",
  },
  {
    _id: "2",
    name: "Pepperoni",
    description: "Spicy pepperoni slices",
    category: "Non-Veg",
  },
  {
    _id: "3",
    name: "Paneer Tikka",
    description: "Paneer and spices",
    category: "Veg",
  },
];

test("shows loading state initially", async () => {
  getAllPizzasMock.mockResolvedValue(samplePizzas);

  render(<PizzaMenu />);

  expect(screen.getByText(/loading pizzas/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByTestId("pizza-card")).toHaveLength(3);
  });
});

test("renders pizzas after successful fetch", async () => {
  getAllPizzasMock.mockResolvedValue(samplePizzas);

  render(<PizzaMenu />);

  await waitFor(() => {
    expect(screen.getByText("Margherita")).toBeInTheDocument();
    expect(screen.getByText("Pepperoni")).toBeInTheDocument();
    expect(screen.getByText("Paneer Tikka")).toBeInTheDocument();
  });
});

test("shows error message if fetch fails", async () => {
  getAllPizzasMock.mockRejectedValue(new Error("API failed"));

  render(<PizzaMenu />);

  await waitFor(() => {
    expect(screen.getByText(/api failed/i)).toBeInTheDocument();
  });
});

test("filters pizzas by Veg tab", async () => {
  const user = userEvent.setup();
  getAllPizzasMock.mockResolvedValue(samplePizzas);

  render(<PizzaMenu />);

  await screen.findByText("Margherita");

  await user.click(screen.getByRole("button", { name: "Veg" }));

  expect(screen.getByText("Margherita")).toBeInTheDocument();
  expect(screen.getByText("Paneer Tikka")).toBeInTheDocument();
  expect(screen.queryByText("Pepperoni")).not.toBeInTheDocument();
});

test("filters pizzas by Non-Veg tab", async () => {
  const user = userEvent.setup();
  getAllPizzasMock.mockResolvedValue(samplePizzas);

  render(<PizzaMenu />);

  await screen.findByText("Margherita");

  await user.click(screen.getByRole("button", { name: "Non-Veg" }));

  expect(screen.getByText("Pepperoni")).toBeInTheDocument();
  expect(screen.queryByText("Margherita")).not.toBeInTheDocument();
});

test("filters pizzas by search query", async () => {
  const user = userEvent.setup();
  getAllPizzasMock.mockResolvedValue(samplePizzas);

  render(<PizzaMenu />);

  await screen.findByText("Margherita");

  const searchInput = screen.getByPlaceholderText(/search your pizza/i);
  await user.type(searchInput, "paneer");

  expect(screen.getByText("Paneer Tikka")).toBeInTheDocument();
  expect(screen.queryByText("Margherita")).not.toBeInTheDocument();
});

test("shows 'No pizzas found' when filter returns empty", async () => {
  const user = userEvent.setup();
  getAllPizzasMock.mockResolvedValue(samplePizzas);

  render(<PizzaMenu />);

  await screen.findByText("Margherita");

  const searchInput = screen.getByPlaceholderText(/search your pizza/i);
  await user.type(searchInput, "xyz");

  expect(screen.getByText(/no pizzas found/i)).toBeInTheDocument();
});