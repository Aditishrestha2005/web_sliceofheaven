// test/AdminPizzasPage.test.tsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AdminPizzasPage from "@/app/admin/pizzas/page";
import { deletePizza, getAllPizzas, pizzaImageUrl } from "@/lib/api/pizza";

// ---- mocks ----
jest.mock("next/link", () => {
  return function Link({ href, children, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockUseSearchParams = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock("@/lib/api/pizza", () => ({
  getAllPizzas: jest.fn(),
  deletePizza: jest.fn(),
  pizzaImageUrl: jest.fn(),
}));

const pizzasFixture = [
  {
    _id: "p1",
    name: "Margherita",
    category: "VEG",
    description: "Classic cheese pizza",
    price: 350,
    image: "marg.jpg",
  },
  {
    _id: "p2",
    name: "Pepperoni",
    category: "NON-VEG",
    description: "Pepperoni and cheese",
    price: 450,
    image: "pep.jpg",
  },
];

describe("AdminPizzasPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (pizzaImageUrl as jest.Mock).mockImplementation((img: string) => `/img/${img}`);
    mockUseSearchParams.mockReturnValue({
      get: (_key: string) => null,
    });
  });

  it("shows loading then renders pizzas grid on success", async () => {
    (getAllPizzas as jest.Mock).mockResolvedValueOnce(pizzasFixture);

    render(<AdminPizzasPage />);

    expect(screen.getByText(/Loading pizzas/i)).toBeInTheDocument();

    expect(await screen.findByText("Margherita")).toBeInTheDocument();
    expect(screen.getByText("Pepperoni")).toBeInTheDocument();

    expect(screen.getByText(/₹\s*350/)).toBeInTheDocument();
    expect(screen.getByText(/₹\s*450/)).toBeInTheDocument();

    expect(screen.getByText("p1")).toBeInTheDocument();
    expect(screen.getByText("p2")).toBeInTheDocument();

    const addLink = screen.getByRole("link", { name: /\+\s*Add Pizza/i });
    expect(addLink).toHaveAttribute("href", "/admin/pizzas/create");
  });

  it("shows empty state when API returns []", async () => {
    (getAllPizzas as jest.Mock).mockResolvedValueOnce([]);

    render(<AdminPizzasPage />);

    expect(await screen.findByText(/No pizzas found/i)).toBeInTheDocument();
  });

  it("shows error state when API fails", async () => {
    (getAllPizzas as jest.Mock).mockRejectedValueOnce(new Error("Boom"));

    render(<AdminPizzasPage />);

    expect(await screen.findByText("Boom")).toBeInTheDocument();
  });

  it("shows toast when ?created=1", async () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "created" ? "1" : null),
    });
    (getAllPizzas as jest.Mock).mockResolvedValueOnce(pizzasFixture);

    render(<AdminPizzasPage />);

    expect(await screen.findByText(/Pizza created successfully/i)).toBeInTheDocument();
  });

  it("deletes a pizza when confirmed", async () => {
    const user = userEvent.setup();

    (getAllPizzas as jest.Mock).mockResolvedValueOnce(pizzasFixture);
    (deletePizza as jest.Mock).mockResolvedValueOnce(undefined);

    const confirmSpy = jest.spyOn(window, "confirm").mockImplementation(() => true);

    render(<AdminPizzasPage />);

    expect(await screen.findByText("Margherita")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", { name: /^delete$/i });
    await user.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalledWith("Delete this pizza?");
    expect(deletePizza).toHaveBeenCalledWith("p1");

    await waitFor(() => {
      expect(screen.queryByText("Margherita")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Pepperoni")).toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it("does not delete when confirm is cancelled", async () => {
    const user = userEvent.setup();

    (getAllPizzas as jest.Mock).mockResolvedValueOnce(pizzasFixture);

    const confirmSpy = jest.spyOn(window, "confirm").mockImplementation(() => false);

    render(<AdminPizzasPage />);

    expect(await screen.findByText("Margherita")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", { name: /^delete$/i });
    await user.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalled();
    expect(deletePizza).not.toHaveBeenCalled();

    expect(screen.getByText("Margherita")).toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it("falls back image src to /pizza.jpg on error", async () => {
    (getAllPizzas as jest.Mock).mockResolvedValueOnce([pizzasFixture[0]]);
    (pizzaImageUrl as jest.Mock).mockImplementation((img: string) => `/img/${img}`);

    render(<AdminPizzasPage />);

    const img = await screen.findByRole("img", { name: "Margherita" });
    expect(img).toHaveAttribute("src", "/img/marg.jpg");

    // ✅ Correct way to trigger React's onError
    fireEvent.error(img);

    expect(img).toHaveAttribute("src", "/pizza.jpg");
  });
});