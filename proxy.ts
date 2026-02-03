import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register", "/forget-password", "/reset-password"];
const adminRoutes = ["/admin"];
const userRoutes = ["/user"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Read cookies directly from request (middleware-safe)
  const token = request.cookies.get("auth_token")?.value || null;
  const userStr = request.cookies.get("user_data")?.value || null;
  const user = userStr ? JSON.parse(userStr) : null;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

  // ✅ Not logged in -> block protected routes
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Logged in -> role checks
  if (token && user) {
    if (isAdminRoute && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isUserRoute && user.role !== "user" && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ✅ If already logged in, block login/register pages
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/login", "/register"],
};
