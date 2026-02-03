"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema, RegisterData } from "../schema";

export default function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submit = async (values: RegisterData) => {
    try {
      const payload = {
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        confirmPassword: values.confirmPassword, // ✅ keep ONLY if backend expects it
      };

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // ✅ safer than res.json() (prevents "unexpected response" crashes)
      const raw = await res.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        setIsError(true);
        setMessage("Server returned invalid response (not JSON).");
        console.error("REGISTER NON-JSON RESPONSE:", raw);
        return;
      }

      if (!res.ok) {
        setIsError(true);
        setMessage(data?.message || "Registration failed");
        return;
      }

      setIsError(false);
      setMessage("Account created! Redirecting to login...");

      setTimeout(() => router.push("/login"), 1200);
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const inputClass =
    "mt-2 w-full h-12 rounded-lg bg-[#FFE1BD] px-4 text-base text-black outline-none focus:ring-2 focus:ring-black/20";

  return (
    <>
      {/* MESSAGE */}
      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-2 text-sm ${
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="space-y-6 text-left">
        {/* Full Name */}
        <div>
          <label className="text-base font-semibold text-black">Full Name</label>
          <input
            {...register("fullName")}
            placeholder="Your full name"
            className={inputClass}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="text-base font-semibold text-black">Username</label>
          <input
            {...register("username")}
            placeholder="Your username"
            className={inputClass}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-base font-semibold text-black">Email</label>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-base font-semibold text-black">Phone Number</label>
          <input
            {...register("phoneNumber")}
            placeholder="98XXXXXXXX"
            className={inputClass}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-base font-semibold text-black">Password</label>
          <input
            {...register("password")}
            type="password"
            autoComplete="new-password"
            placeholder="******"
            className={inputClass}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-base font-semibold text-black">Confirm Password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            autoComplete="new-password"
            placeholder="******"
            className={inputClass}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 mt-4 rounded-full bg-[#E39A3B] text-base font-semibold text-black hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>

        {/* Login Link */}
        <p className="text-center text-base mt-4 text-black">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-orange-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </>
  );
}
