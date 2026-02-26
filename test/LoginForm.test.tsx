import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../app/(auth)/_components/LoginForm";

const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

jest.mock("next/link", () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

beforeEach(() => {
  pushMock.mockClear();
  refreshMock.mockClear();
  (global.fetch as any) = jest.fn();

  // jsdom sometimes doesn't have atob
  if (!(global as any).atob) {
    (global as any).atob = (b64: string) =>
      Buffer.from(b64, "base64").toString("binary");
  }
});

test("renders login form fields", () => {
  render(<LoginForm />);

  // ✅ use placeholders (because label isn't linked with htmlFor/id)
  expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("******")).toBeInTheDocument();

  // button text in your component is "Get Started"
  expect(screen.getByRole("button", { name: /get started/i })).toBeInTheDocument();

  // forget password link
  expect(screen.getByText(/forget password\?/i)).toBeInTheDocument();
});

test("successful login redirects to /dashboard", async () => {
  const user = userEvent.setup();

  (global.fetch as any).mockResolvedValue   ({
    ok: true,
    status: 200,
    text: async () =>
      JSON.stringify({
        token: "aaa.bbb.ccc",
        data: { role: "user", email: "test@example.com" },
      }),
  });

  render(<LoginForm />);

  await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
  await user.type(screen.getByPlaceholderText("******"), "123456");
  await user.click(screen.getByRole("button", { name: /get started/i }));

  expect(await screen.findByText(/login successful/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
    expect(refreshMock).toHaveBeenCalled();
  });
});