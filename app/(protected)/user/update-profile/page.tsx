"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAuthToken } from "@/lib/cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, loading, checkAuth } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // ✅ fill form from current user
  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || "",
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
    });
  }, [user]);

  // ✅ guard
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setIsError(false);

    try {
      const token = await getAuthToken();

      // ✅ IMPORTANT: change endpoint if your backend uses different
      // Common: PUT /api/user/profile or PUT /api/users/:id
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setIsError(true);
        setMessage(data?.message || `Failed to update profile (${res.status})`);
        return;
      }

      setIsError(false);
      setMessage(data?.message || "Profile updated successfully!");

      // ✅ refresh cookie/user in context
      await checkAuth();

      // ✅ go back to profile
      router.replace("/user/profile");
    } catch (err) {
      setIsError(true);
      setMessage("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-orange-700">Update Profile</h1>
            <p className="text-sm text-orange-900/60">Edit your personal information.</p>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-orange-300 px-5 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
          >
            Back
          </button>
        </div>

        {message && (
          <div
            className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${
              isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 rounded-3xl bg-white border border-orange-100 shadow-lg p-6 space-y-5">
          <Field label="Full Name">
            <input
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              className="h-12 w-full rounded-2xl border border-orange-200 bg-orange-50/40 px-4 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Full Name"
              required
            />
          </Field>

          <Field label="Username">
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              className="h-12 w-full rounded-2xl border border-orange-200 bg-orange-50/40 px-4 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Username"
              required
            />
          </Field>

          <Field label="Email">
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              className="h-12 w-full rounded-2xl border border-orange-200 bg-orange-50/40 px-4 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Email"
              required
            />
          </Field>

          <Field label="Phone Number">
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={onChange}
              className="h-12 w-full rounded-2xl border border-orange-200 bg-orange-50/40 px-4 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Phone Number"
              required
            />
          </Field>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.replace("/user/profile")}
              className="h-12 rounded-full border border-orange-300 px-8 text-sm font-semibold text-orange-800 hover:bg-orange-50"
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-12 rounded-full bg-[#E39A3B] px-10 text-sm font-extrabold text-black hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-orange-900/80">{label}</label>
      {children}
    </div>
  );
}
