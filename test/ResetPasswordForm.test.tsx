import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordForm from "../app/(auth)/_components/ResetpasswordForm"; // adjust if needed

jest.mock("next/link", () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

const handleResetPasswordMock = jest.fn();

jest.mock("@/lib/actions/auth-action", () => ({
  handleResetPassword: (token: string, password: string) =>
    handleResetPasswordMock(token, password),
}));

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
  replaceMock.mockClear();
  handleResetPasswordMock.mockClear();
  toastSuccessMock.mockClear();
  toastErrorMock.mockClear();
});

test("renders reset password form", () => {
  render(<ResetPasswordForm token="test-token" />);

  expect(screen.getAllByPlaceholderText("••••••••")).toHaveLength(2);
  expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  expect(screen.getByText(/back to login/i)).toBeInTheDocument();
});

test("shows validation errors when submitting empty", async () => {
  const user = userEvent.setup();
  render(<ResetPasswordForm token="test-token" />);

  await user.click(screen.getByRole("button", { name: /reset password/i }));

  // ✅ use exact text to avoid matching both
  expect(
    await screen.findByText("Password must be at least 8 characters long")
  ).toBeInTheDocument();

  expect(
    await screen.findByText("Confirm Password must be at least 8 characters long")
  ).toBeInTheDocument();

  expect(handleResetPasswordMock).not.toHaveBeenCalled();
});

test("shows 'Passwords do not match' when passwords differ", async () => {
  const user = userEvent.setup();
  render(<ResetPasswordForm token="test-token" />);

  const inputs = screen.getAllByPlaceholderText("••••••••");
  await user.type(inputs[0], "12345678");
  await user.type(inputs[1], "87654321");

  await user.click(screen.getByRole("button", { name: /reset password/i }));

  expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  expect(handleResetPasswordMock).not.toHaveBeenCalled();
});

test("success: calls action, shows success toast, redirects to /login", async () => {
  const user = userEvent.setup();

  handleResetPasswordMock.mockResolvedValue({ success: true });

  render(<ResetPasswordForm token="test-token" />);

  const inputs = screen.getAllByPlaceholderText("••••••••");
  await user.type(inputs[0], "12345678");
  await user.type(inputs[1], "12345678");

  await user.click(screen.getByRole("button", { name: /reset password/i }));

  await waitFor(() => {
    expect(handleResetPasswordMock).toHaveBeenCalledWith("test-token", "12345678");
    expect(toastSuccessMock).toHaveBeenCalledWith("Password reset successfully");
    expect(replaceMock).toHaveBeenCalledWith("/login");
  });
});

test("failure: shows error toast when action returns success=false", async () => {
  const user = userEvent.setup();

  handleResetPasswordMock.mockResolvedValue({
    success: false,
    message: "Token expired",
  });

  render(<ResetPasswordForm token="test-token" />);

  const inputs = screen.getAllByPlaceholderText("••••••••");
  await user.type(inputs[0], "12345678");
  await user.type(inputs[1], "12345678");

  await user.click(screen.getByRole("button", { name: /reset password/i }));

  await waitFor(() => {
    expect(toastErrorMock).toHaveBeenCalledWith("Token expired");
    expect(replaceMock).not.toHaveBeenCalled();
  });
});

test("throws: shows unexpected error toast", async () => {
  const user = userEvent.setup();

  handleResetPasswordMock.mockRejectedValue(new Error("boom"));

  render(<ResetPasswordForm token="test-token" />);

  const inputs = screen.getAllByPlaceholderText("••••••••");
  await user.type(inputs[0], "12345678");
  await user.type(inputs[1], "12345678");

  await user.click(screen.getByRole("button", { name: /reset password/i }));

  await waitFor(() => {
    expect(toastErrorMock).toHaveBeenCalledWith("An unexpected error occurred");
  });
});