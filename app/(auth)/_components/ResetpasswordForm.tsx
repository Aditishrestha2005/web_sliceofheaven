"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ArrowLeft } from "lucide-react";

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordDTO>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onSubmit",
  });

  const router = useRouter();

  const onSubmit = async (data: ResetPasswordDTO) => {
    try {
      const response = await handleResetPassword(token, data.password);
      if (response.success) {
        toast.success("Password reset successfully");
        router.replace("/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 flex items-center justify-center">
      {/* Soft brand blobs */}
      <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-orange-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-white/95 backdrop-blur border border-orange-100 shadow-xl shadow-orange-900/10 ring-1 ring-slate-900/5">
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-orange-600 shadow-lg shadow-orange-600/25">
                <Lock className="h-7 w-7 text-white" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                New Password
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create a strong password to secure your account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  New password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={[
                    "w-full rounded-xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400",
                    "outline-none transition",
                    errors.password
                      ? "border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-slate-300 focus:border-orange-600 focus:ring-4 focus:ring-orange-100",
                  ].join(" ")}
                />
                {errors.password && (
                  <p className="mt-2 text-xs font-semibold text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Confirm password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className={[
                    "w-full rounded-xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400",
                    "outline-none transition",
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-slate-300 focus:border-orange-600 focus:ring-4 focus:ring-orange-100",
                  ].join(" ")}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-xs font-semibold text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={[
                  "mt-2 w-full rounded-xl py-3.5 text-sm font-extrabold text-white",
                  "bg-orange-600 hover:bg-orange-700 active:scale-[0.99]",
                  "transition shadow-lg shadow-orange-600/25",
                  "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100",
                ].join(" ")}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>

              {/* Links */}
              <div className="pt-1 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold text-orange-700 hover:text-orange-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>

                <div className="mt-3">
                  <Link
                    href="/request-password-reset"
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    Request another link
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* Footer strip */}
          <div className="border-t border-orange-100 bg-orange-50/70 px-8 py-4 text-center rounded-b-3xl">
            <p className="text-xs font-semibold text-slate-700">
              Tip: Use 8+ characters with numbers & symbols.
            </p>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
