import { render, screen } from "@testing-library/react";
import LandingPage from "../app/(auth)/home/page";

// Mock next/link
jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

// Mock next/image (IMPORTANT: remove fill/priority so React doesn't complain)
jest.mock("next/image", () => {
  return function MockImage(props: any) {
    const { src, alt, width, height, ...rest } = props;

    // remove Next-only props that break DOM
    delete rest.fill;
    delete rest.priority;
    delete rest.quality;
    delete rest.placeholder;
    delete rest.blurDataURL;

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || "image"} width={width} height={height} {...rest} />;
  };
});

test("renders navbar brand and auth links", () => {
  render(<LandingPage />);

  // ✅ target the BRAND link specifically (only one)
  const brand = screen.getByRole("link", { name: /^slice of heaven$/i });
  expect(brand).toHaveAttribute("href", "/");

  expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login");
  expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/register");
});

test("hero section renders and Order Now routes to dashboard", () => {
  render(<LandingPage />);

  expect(screen.getByRole("heading", { name: /your favorite/i })).toBeInTheDocument();

  expect(screen.getByRole("link", { name: /order now/i })).toHaveAttribute("href", "/dashboard");
});

test("about section shows 4 features", () => {
  render(<LandingPage />);

  expect(screen.getByText(/fast delivery/i)).toBeInTheDocument();
  expect(screen.getByText(/best quality/i)).toBeInTheDocument();
  expect(screen.getByText(/24\/7 service/i)).toBeInTheDocument();
  expect(screen.getByText(/easy ordering/i)).toBeInTheDocument();
});