// import { NextRequest, NextResponse } from "next/server";
// import { getAuthToken, getUserData } from "./lib/cookies";

// const publicPaths = ["/login", "/signup", "/register", "/forget-password"];
// const protectedPaths = ["/admin", "/user", "/dashboard"];

// export async function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   let token: string | null = null;
//   let user: any = null;

//   try {
//     token = (await getAuthToken()) || null;
//     user = token ? await getUserData() : null;
//   } catch {
//     token = null;
//     user = null;
//   }

//   const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));
//   const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));

//   // 1) If NOT logged in and trying to access protected areas
//   if ((!token || !user) && isProtectedPath) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // 2) If logged in and trying to access public auth pages
//   // Redirect Admin to /admin/users and Users to /dashboard
//   if (token && user && isPublicPath) {
//     const target = user.role === "admin" ? "/admin/users" : "/dashboard";
//     return NextResponse.redirect(new URL(target, req.url));
//   }

//   // 3) Role-Based Access Control
//   if (token && user) {
//     // Protect Admin routes
//     if (pathname.startsWith("/admin") && user.role !== "admin") {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//     // Protect User routes (Admins can also access /user)
//     if (
//       pathname.startsWith("/user") &&
//       user.role !== "user" &&
//       user.role !== "admin"
//     ) {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// // ✅ default export required for Next proxy system
// export default proxy;

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/admin/:path*",
//     "/user/:path*",
//     "/update-profile/:path*",
//     "/login",
//     "/signup",
//     "/register",
//     "/forget-password",
//   ],
// };


import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookies";

const protectedPaths = ["/admin", "/user", "/dashboard"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let token: string | null = null;
  let user: any = null;

  try {
    token = (await getAuthToken()) || null;
    user = token ? await getUserData() : null;
  } catch {
    token = null;
    user = null;
  }

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // ✅ Only protect protected routes
  if (isProtected && (!token || !user)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Role-based admin protection
  if (pathname.startsWith("/admin") && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/user/:path*"],
};
