"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [pending, startTransition] = useTransition();

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      // Simulate login request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ✅ Redirect to dashboard after login
      router.push("/dashboard");
    });

    console.log("login", values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 text-left">

      {/* Email */}
      <div>
        <label className="text-base font-semibold text-black">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black placeholder-black/60 outline-none focus:ring-2 focus:ring-black/20"
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
          className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black placeholder-black/60 outline-none focus:ring-2 focus:ring-black/20"
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
        disabled={isSubmitting || pending}
        className="w-full h-12 mt-4 rounded-full bg-[#E39A3B] text-base font-semibold text-black hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Logging in..." : "Log in"}
      </button>

      {/* Signup Link */}
      <p className="text-center text-base mt-4 text-black">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-orange-500 hover:underline"
        >
          Sign up
        </Link>
      </p>

    </form>
  );
}
