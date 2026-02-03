"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginData, loginSchema } from "../schema";

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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const raw = await res.text();
      let data: any = null;

      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        console.error("LOGIN NON-JSON RESPONSE:", raw);
        setIsError(true);
        setMessage("Server returned invalid response.");
        return;
      }

      console.log("LOGIN STATUS:", res.status);
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        setIsError(true);
        setMessage(data?.message || `Login failed (${res.status})`);
        return;
      }

      // ✅ SAVE AUTH DATA FIRST
      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.data) localStorage.setItem("user", JSON.stringify(data.data));

      setIsError(false);
      setMessage("Login successful! Redirecting...");

      // ✅ ABSOLUTE PATH (THIS WAS THE BUG)
      router.push("/dashboard");
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
            isError
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="space-y-6 text-left">
        {/* Email */}
        <div>
          <label className="text-base font-semibold text-black">Email</label>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-base font-semibold text-black">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            autoComplete="current-password"
            placeholder="******"
            className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 mt-4 rounded-full bg-[#E39A3B] text-base font-semibold text-black hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        {/* Signup Link */}
        <p className="text-center text-base mt-4 text-black">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-orange-500 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
}
