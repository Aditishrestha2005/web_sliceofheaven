import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "../app/(auth)/_components/RegisterForm";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("next/link", () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

beforeEach(() => {
  pushMock.mockClear();
  (global.fetch as any) = jest.fn();
});

test("renders register form fields", () => {
  render(<RegisterForm />);

  expect(screen.getByPlaceholderText("Your full name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Your username")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("98XXXXXXXX")).toBeInTheDocument();
  expect(screen.getAllByPlaceholderText("******")).toHaveLength(2);

  expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
});

test("successful register shows success message and redirects to /login", async () => {
  // ✅ fake timers for setTimeout redirect
  jest.useFakeTimers();

  // ✅ userEvent must be configured to work with fake timers
  const user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  });

  (global.fetch as any).mockResolvedValue({
    ok: true,
    status: 201,
    text: async () => JSON.stringify({ message: "ok" }),
  });

  render(<RegisterForm />);

  await user.type(screen.getByPlaceholderText("Your full name"), "Test User");
  await user.type(screen.getByPlaceholderText("Your username"), "testuser");
  await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
  await user.type(screen.getByPlaceholderText("98XXXXXXXX"), "9812345678");

  const pw = screen.getAllByPlaceholderText("******");
  await user.type(pw[0], "123456");
  await user.type(pw[1], "123456");

  await user.click(screen.getByRole("button", { name: /sign up/i }));

  expect(await screen.findByText(/account created/i)).toBeInTheDocument();

  // ✅ trigger the 1200ms redirect
  jest.advanceTimersByTime(1200);

  await waitFor(() => {
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  jest.useRealTimers();
});