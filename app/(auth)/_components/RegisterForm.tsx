"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const [pending, startTransition] = useTransition();

  const submit = async (values: RegisterData) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/login");
    });
    console.log("register", values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 text-left">

      {/* Username */}
      <div>
        <label className="text-base font-semibold text-black">
          Username
        </label>
        <input
          {...register("name")}
          type="text"
          autoComplete="name"
          className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black placeholder-black/60 outline-none focus:ring-2 focus:ring-black/20"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="text-base font-semibold text-black">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
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
          autoComplete="new-password"
          className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black placeholder-black/60 outline-none focus:ring-2 focus:ring-black/20"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-base font-semibold text-black">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          autoComplete="new-password"
          className="mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black placeholder-black/60 outline-none focus:ring-2 focus:ring-black/20"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full h-12 mt-4 rounded-full bg-[#E39A3B] text-base font-semibold text-black hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Creating account..." : "Sign up"}
      </button>

      {/* Login Link */}
      <p className="text-center text-base mt-4 text-black">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-orange-500 hover:underline"
        >
          Log in
        </Link>
      </p>

    </form>
  );
}
