import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/(auth)/forget-password/page"; // ✅ adjust if your path differs

// ---- Mock next/link ----
jest.mock("next/link", () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

// ---- Mock API function ----
const requestPasswordResetMock = jest.fn();

jest.mock("@/lib/api/auth", () => ({
  requestPasswordReset: (email: string) => requestPasswordResetMock(email),
}));

// ---- Mock toast ----
const toastSuccessMock = jest.fn();
const toastErrorMock = jest.fn();

jest.mock("react-toastify", () => ({
  toast: {
    success: (msg: string) => toastSuccessMock(msg),
    error: (msg: string) => toastErrorMock(msg),
  },
  ToastContainer: () => <div />,
}));

beforeEach(() => {
  requestPasswordResetMock.mockClear();
  toastSuccessMock.mockClear();
  toastErrorMock.mockClear();
});

test("renders forget password page", () => {
  render(<Page />);

  expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
});

test("shows validation error when email is empty", async () => {
  const user = userEvent.setup();
  render(<Page />);

  await user.click(screen.getByRole("button", { name: /send reset link/i }));

  expect(
    await screen.findByText(/please enter a valid email address/i)
  ).toBeInTheDocument();

  expect(requestPasswordResetMock).not.toHaveBeenCalled();
});

test("shows success toast when API succeeds", async () => {
  const user = userEvent.setup();

  requestPasswordResetMock.mockResolvedValue({
    success: true,
    message: "Reset link sent!",
  });

  render(<Page />);

  await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
  await user.click(screen.getByRole("button", { name: /send reset link/i }));

  await waitFor(() => {
    expect(requestPasswordResetMock).toHaveBeenCalledWith("test@example.com");
    expect(toastSuccessMock).toHaveBeenCalledWith("Reset link sent!");
  });
});

test("shows error toast when API fails", async () => {
  const user = userEvent.setup();

  requestPasswordResetMock.mockResolvedValue({
    success: false,
    message: "User not found",
  });

  render(<Page />);

  await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
  await user.click(screen.getByRole("button", { name: /send reset link/i }));

  await waitFor(() => {
    expect(requestPasswordResetMock).toHaveBeenCalledWith("test@example.com");
    expect(toastErrorMock).toHaveBeenCalledWith("User not found");
  });
});

test("shows error toast when API throws", async () => {
  const user = userEvent.setup();

  requestPasswordResetMock.mockRejectedValue(new Error("Network error"));

  render(<Page />);

  await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
  await user.click(screen.getByRole("button", { name: /send reset link/i }));

  await waitFor(() => {
    expect(requestPasswordResetMock).toHaveBeenCalledWith("test@example.com");
    expect(toastErrorMock).toHaveBeenCalledWith("Network error");
  });
});