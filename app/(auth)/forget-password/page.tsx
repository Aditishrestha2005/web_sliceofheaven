"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/lib/api/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2, Mail, ArrowLeft, Sparkles } from "lucide-react";

export const RequestPasswordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetDTO>({
    resolver: zodResolver(RequestPasswordResetSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: RequestPasswordResetDTO) => {
    try {
      const response = await requestPasswordReset(data.email);

      if (response.success) {
        toast.success(response.message || "Reset link sent!");
      } else {
        toast.error(response.message || "Failed to send reset link.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <div className="w-full max-w-md">

        {/* Back to login */}
        <div className="mb-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-orange-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-orange-200 bg-white shadow-xl shadow-orange-900/10 p-8">

          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-black border border-orange-200">
              <Sparkles className="h-4 w-4 text-orange-600" />
              Slice of Heaven
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-black">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm text-black">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Email address
              </label>

              <div
                className={[
                  "flex items-center gap-2 rounded-2xl border px-4 py-3 bg-white transition-all duration-200",
                  errors.email
                    ? "border-red-400 ring-2 ring-red-100"
                    : "border-orange-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100",
                ].join(" ")}
              >
                <Mail
                  className={`h-5 w-5 ${
                    errors.email ? "text-red-500" : "text-orange-600"
                  }`}
                />

                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full bg-transparent text-black placeholder:text-gray-400 outline-none"
                />
              </div>

              {errors.email && (
                <p className="text-red-600 text-sm mt-2 font-semibold">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl py-3.5 font-bold text-white bg-orange-600 hover:bg-orange-700 active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending link...
                </span>
              ) : (
                "Send reset link"
              )}
            </button>

            {/* Footer Links */}
            <div className="text-center text-sm text-black">

              <div>
                Remembered?{" "}
                <Link
                  href="/login"
                  className="font-bold text-orange-700 hover:underline"
                >
                  Log in
                </Link>
              </div>

              <div className="mt-3">
                New here?{" "}
                <Link
                  href="/register"
                  className="font-bold text-orange-700 hover:underline"
                >
                  Create account
                </Link>
              </div>

              <div className="mt-6 border-t border-orange-200 pt-4">
                <p className="text-xs text-black">
                  Check your spam folder if the email doesn't arrive within a few minutes.
                </p>
              </div>
            </div>

          </form>
        </div>

        {/* Bottom Text */}
        <p className="mt-8 text-center text-xs text-black">
          Secure password recovery • Slice of Heaven
        </p>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
