// import { NextRequest, NextResponse } from "next/server";
// import { getAuthToken, getUserData } from "./lib/cookies";

// export async function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const token = await getAuthToken();
//   const user = token ? await getUserData() : null;

//   // 🔒 If accessing protected routes without login
//   if (
//     (pathname.startsWith("/admin") ||
//       pathname.startsWith("/dashboard") ||
//       pathname.startsWith("/user")) &&
//     (!token || !user)
//   ) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // 🚫 Prevent logged-in users from visiting login/register again
//   if (
//     (pathname === "/login" || pathname === "/register") &&
//     token &&
//     user
//   ) {
//     if (user.role === "admin") {
//       return NextResponse.redirect(new URL("/admin/dashboard", req.url));
//     } else {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }
//   }

//   // 🔐 Admin protection
//   if (pathname.startsWith("/admin") && user?.role !== "admin") {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// export default proxy;

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/dashboard/:path*",
//     "/user/:path*",
//     "/login",
//     "/register",
//   ],
// };



import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookies";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getAuthToken();
  const user = token ? await getUserData() : null;

  const role = (user?.role || "").toLowerCase();

  // 🔒 If accessing protected routes without login
  if (
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/user")) &&
    (!token || !user)
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🚫 Prevent logged-in users from visiting login/register again
  if ((pathname === "/login" || pathname === "/register") && token && user) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 🔐 Admin protection (case-insensitive)
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/user/:path*",
    "/login",
    "/register",
  ],
};


