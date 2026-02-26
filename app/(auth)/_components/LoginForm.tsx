// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { LoginData, loginSchema } from "../schema";

// // ✅ simple cookie setter (proxy can read these cookies)
// function setCookie(name: string, value: string, days = 7) {
//   const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
//   document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
// }

// export default function LoginForm() {
//   const router = useRouter();
//   const [message, setMessage] = useState<string | null>(null);
//   const [isError, setIsError] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginData>({
//     resolver: zodResolver(loginSchema),
//     mode: "onSubmit",
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const submit = async (values: LoginData) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });

//       const raw = await res.text();
//       let data: any = null;

//       try {
//         data = raw ? JSON.parse(raw) : null;
//       } catch {
//         console.error("LOGIN NON-JSON RESPONSE:", raw);
//         setIsError(true);
//         setMessage("Server returned invalid response.");
//         return;
//       }

//       console.log("LOGIN STATUS:", res.status);
//       console.log("LOGIN RESPONSE:", data);

//       if (!res.ok) {
//         setIsError(true);
//         setMessage(data?.message || `Login failed (${res.status})`);
//         return;
//       }

//       // ✅ SAVE AUTH DATA TO COOKIES (so proxy.ts can read)
//       if (data?.token) setCookie("auth_token", data.token);
//       if (data?.data) setCookie("user_data", JSON.stringify(data.data));

//       // ✅ optional: keep localStorage if you use it elsewhere
//       if (data?.token) localStorage.setItem("token", data.token);
//       if (data?.data) localStorage.setItem("user", JSON.stringify(data.data));

//       setIsError(false);
//       setMessage("Login successful! Redirecting...");

//       // ✅ keep your redirect as-is (change if you want)
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("LOGIN ERROR:", error);
//       setIsError(true);
//       setMessage("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <>
//       {message && (
//         <div
//           className={`mb-4 rounded-lg px-4 py-2 text-sm ${
//             isError
//               ? "bg-red-100 text-red-700"
//               : "bg-green-100 text-green-700"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit(submit)} className="space-y-6 text-left">
//         {/* Email */}
//         <div>
//           <label className="text-base font-semibold text-black">Email</label>
//           <input
//             {...register("email")}
//             type="email"
//             autoComplete="email"
//             placeholder="you@example.com"
//             className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600">
//               {errors.email.message}
//             </p>
//           )}
//         </div>

//         {/* Password */}
//         <div>
//           <label className="text-base font-semibold text-black">
//             Password
//           </label>
//           <input
//             {...register("password")}
//             type="password"
//             autoComplete="current-password"
//             placeholder="******"
//             className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
//           />
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-600">
//               {errors.password.message}
//             </p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full h-12 mt-4 rounded-full bg-[#E39A3B] text-base font-semibold text-black hover:opacity-90 disabled:opacity-60"
//         >
//           {isSubmitting ? "Logging in..." : "Log in"}
//         </button>

//         {/* Signup Link */}
//         <p className="text-center text-base mt-4 text-black">
//           Don&apos;t have an account?{" "}
//           <Link
//             href="/register"
//             className="font-semibold text-orange-500 hover:underline"
//           >
//             Sign up
//           </Link>
//         </p>
//       </form>
//     </>
//   );
// }

// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { LoginData, loginSchema } from "../schema";

// // ✅ cookie helper
// function setCookie(name: string, value: string, days = 7) {
//   const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
//   document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
// }

// export default function LoginForm() {
//   const router = useRouter();
//   const [message, setMessage] = useState<string | null>(null);
//   const [isError, setIsError] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginData>({
//     resolver: zodResolver(loginSchema),
//     mode: "onSubmit",
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const submit = async (values: LoginData) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });

//       const raw = await res.text();
//       let data: any = null;

//       try {
//         data = raw ? JSON.parse(raw) : null;
//       } catch {
//         console.error("LOGIN NON-JSON RESPONSE:", raw);
//         setIsError(true);
//         setMessage("Server returned invalid response.");
//         return;
//       }

//       if (!res.ok) {
//         setIsError(true);
//         setMessage(data?.message || `Login failed (${res.status})`);
//         return;
//       }

//       // ✅ SAVE AUTH TO COOKIES (proxy.ts uses cookies)
//       if (data?.token) setCookie("auth_token", data.token);
//       if (data?.data) setCookie("user_data", JSON.stringify(data.data));

//       setIsError(false);
//       setMessage("Login successful! Redirecting...");

//       // ✅ redirect by role
//       const role = data?.data?.role;
//       if (role === "admin") router.push("/admin/users");
//       else router.push("/dashboard");
//     } catch (error) {
//       console.error("LOGIN ERROR:", error);
//       setIsError(true);
//       setMessage("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <>
//       {message && (
//         <div
//           className={`mb-4 rounded-lg px-4 py-2 text-sm ${
//             isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit(submit)} className="space-y-6 text-left">
//         <div>
//           <label className="text-base font-semibold text-black">Email</label>
//           <input
//             {...register("email")}
//             type="email"
//             autoComplete="email"
//             placeholder="you@example.com"
//             className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="text-base font-semibold text-black">Password</label>
//           <input
//             {...register("password")}
//             type="password"
//             autoComplete="current-password"
//             placeholder="******"
//             className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
//           />
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full h-12 mt-4 rounded-full bg-[#E39A3B] text-base font-semibold text-black hover:opacity-90 disabled:opacity-60"
//         >
//           {isSubmitting ? "Logging in..." : "Log in"}
//         </button>

//         <p className="text-center text-base mt-4 text-black">
//           Don&apos;t have an account?{" "}
//           <Link href="/register" className="font-semibold text-orange-500 hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </form>
//     </>
//   );
// }






// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { LoginData, loginSchema } from "../schema";

// function setCookie(name: string, value: string, days = 7) {
//   const expires = new Date(Date.now() + days * 86400000).toUTCString();
//   document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
// }

// export default function LoginForm() {
//   const router = useRouter();
//   const [message, setMessage] = useState<string | null>(null);
//   const [isError, setIsError] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginData>({
//     resolver: zodResolver(loginSchema),
//   });

//   const submit = async (values: LoginData) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setIsError(true);
//         setMessage(data?.message || "Login failed");
//         return;
//       }

//       // ✅ save cookies
//       setCookie("auth_token", data.token);
//       setCookie("user_data", JSON.stringify(data.data));

//       setIsError(false);
//       setMessage("Login successful! Redirecting...");

//       // ✅ role based redirect
//       if (data.data.role === "admin") {
//         router.push("/admin/dashboard");
//       } else {
//         router.push("/dashboard");
//       }

//     } catch (error) {
//       setIsError(true);
//       setMessage("Something went wrong.");
//     }
//   };

//   return (
//     <>
//       {message && (
//         <div className={`mb-4 p-2 rounded ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit(submit)} className="space-y-4">
//         <div>
//           <input
//             {...register("email")}
//             type="email"
//             placeholder="Email"
//             className="w-full border p-2 rounded"
//           />
//           {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
//         </div>

//         <div>
//           <input
//             {...register("password")}
//             type="password"
//             placeholder="Password"
//             className="w-full border p-2 rounded"
//           />
//           {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full bg-orange-600 text-white py-2 rounded"
//         >
//           {isSubmitting ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </>
//   );
// }



// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { LoginData, loginSchema } from "../schema";

// // ✅ cookie helper (keep SameSite so proxy can read it)
// function setCookie(name: string, value: string, days = 7) {
//   const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
//   document.cookie = `${name}=${encodeURIComponent(
//     value
//   )}; expires=${expires}; path=/; SameSite=Lax`;
// }

// export default function LoginForm() {
//   const router = useRouter();
//   const [message, setMessage] = useState<string | null>(null);
//   const [isError, setIsError] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginData>({
//     resolver: zodResolver(loginSchema),
//     mode: "onSubmit",
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const submit = async (values: LoginData) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });

//       // ✅ safer parse (handles non-json errors too)
//       const raw = await res.text();
//       let data: any = null;

//       try {
//         data = raw ? JSON.parse(raw) : null;
//       } catch {
//         console.error("LOGIN NON-JSON RESPONSE:", raw);
//         setIsError(true);
//         setMessage("Server returned invalid response.");
//         return;
//       }

//       if (!res.ok) {
//         setIsError(true);
//         setMessage(data?.message || `Login failed (${res.status})`);
//         return;
//       }

//       // ✅ backend format: { token, data: user }
//       const token = data?.token;
//       const user = data?.data;

//       if (!token || !user) {
//         setIsError(true);
//         setMessage("Login response missing token/user.");
//         return;
//       }

//       // ✅ SAVE AUTH TO COOKIES (proxy.ts + server pages use these)
//       setCookie("auth_token", token);
//       setCookie("user_data", JSON.stringify(user));

//       setIsError(false);
//       setMessage("Login successful! Redirecting...");

//       // ✅ redirect by role (THIS is the main fix)
//       if (user.role === "admin") {
//         router.push("/admin/dashboard");
//       } else {
//         router.push("/dashboard");
//       }

//       // ✅ helps server pages read new cookies immediately
//       router.refresh();
//     } catch (error) {
//       console.error("LOGIN ERROR:", error);
//       setIsError(true);
//       setMessage("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <>
//       {message && (
//         <div
//           className={`mb-4 rounded-lg px-4 py-2 text-sm ${
//             isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit(submit)} className="space-y-6 text-left">
//         <div>
//           <label className="text-base font-semibold text-black">Email</label>
//           <input
//             {...register("email")}
//             type="email"
//             autoComplete="email"
//             placeholder="you@example.com"
//             className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="text-base font-semibold text-black">Password</label>
//           <input
//             {...register("password")}
//             type="password"
//             autoComplete="current-password"
//             placeholder="******"
//             className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
//           />
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full h-12 mt-4 rounded-full bg-[#E39A3B] text-base font-semibold text-black hover:opacity-90 disabled:opacity-60"
//         >
//           {isSubmitting ? "Logging in..." : "Log in"}
//         </button>

//         <p className="text-center text-base mt-4 text-black">
//           Don&apos;t have an account?{" "}
//           <Link
//             href="/register"
//             className="font-semibold text-orange-500 hover:underline"
//           >
//             Sign up
//           </Link>
//         </p>
//       </form>
//     </>
//   );
// }







"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginData, loginSchema } from "../schema";

// ✅ cookie helper
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

// ✅ delete cookie (IMPORTANT to remove old admin user_data)
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = async (values: LoginData) => {
    try {
      setIsError(false);
      setMessage(null);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      // ✅ safer parse (handles non-json errors too)
      const raw = await res.text();
      let data: any = null;

      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        setIsError(true);
        setMessage("Server returned invalid response.");
        return;
      }

      if (!res.ok) {
        setIsError(true);
        setMessage(data?.message || `Login failed (${res.status})`);
        return;
      }

      // backend format: { success, message, data: user, token }
      const token = data?.token;
      const user = data?.data;

      if (!token || !user) {
        setIsError(true);
        setMessage("Login response missing token/user.");
        return;
      }

      // ✅ DEBUG (to prove what's happening)
      console.log("LOGIN USER FROM API:", user);
      console.log("LOGIN ROLE FROM API:", user?.role);

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("ROLE IN JWT:", payload?.role);
      } catch {
        console.log("JWT decode failed");
      }

      // ✅ IMPORTANT: clear stale cookies first
      deleteCookie("auth_token");
      deleteCookie("user_data");

      // ✅ save fresh cookies (proxy.ts reads these)
      setCookie("auth_token", token);
      setCookie("user_data", JSON.stringify(user));

      setIsError(false);
      setMessage("Login successful! Redirecting...");

      // ✅ role-based redirect (safe)
      if (user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }

      // ✅ ensures server components/middleware read latest cookies
      router.refresh();
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-2 text-sm ${
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="space-y-5 text-left">
        {/* Email */}
        <div>
          <label className="text-base font-semibold text-black">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-base font-semibold text-black">Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="******"
            className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
          />

          {/* Forget password */}
          <div className="mt-2 text-right">
            <Link
              href="/forget-password"
              className="text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline"
            >
              Forget password?
            </Link>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-full bg-[#E39A3B] text-base font-semibold text-black hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Get Started"}
        </button>

        {/* Register */}
        <p className="text-center text-base text-black">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-orange-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
}
