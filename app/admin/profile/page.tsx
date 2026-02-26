"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/cookies";

type StoredUser = {
  _id?: string;
  fullName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
  role?: string;
};

type TabKey = "personal" | "security";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

function absImg(path?: string) {
  if (!path) return "/profile.png";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export default function AdminProfilePage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [user, setUser] = useState<StoredUser | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "********",
  });

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName = useMemo(
    () => user?.fullName || user?.username || "Admin",
    [user]
  );

  // ✅ load admin from cookie + guard role
  useEffect(() => {
    try {
      const token = getCookie("auth_token");
      const rawUser = getCookie("user_data");

      if (!token) {
        router.push("/login");
        return;
      }

      if (rawUser) {
        const parsed: StoredUser = JSON.parse(rawUser);

        // ✅ protect: only admin can stay here
        if ((parsed.role || "").toLowerCase() !== "admin") {
          router.push("/dashboard");
          return;
        }

        setUser(parsed);
        setForm({
          fullName: parsed.fullName || "",
          username: parsed.username || "",
          email: parsed.email || "",
          phoneNumber: parsed.phoneNumber || "",
          password: "********",
        });
      }
    } catch (e) {
      console.error("Admin profile load error:", e);
      router.push("/login");
    }
  }, [router]);

  const discardChanges = () => {
    if (!user) return;
    setMessage(null);
    setIsError(false);
    setForm({
      fullName: user.fullName || "",
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      password: "********",
    });
  };

  // ✅ Save admin profile to MongoDB (same endpoint as user)
  // If your backend uses /api/auth/update-profile, change URL here.
  const saveChanges = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);
    setIsError(false);

    try {
      const token = await getAuthToken();

      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          phoneNumber: form.phoneNumber,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setIsError(true);
        setMessage(data?.message || "Failed to update profile.");
        return;
      }

      const updatedUser: StoredUser = data?.data || {
        ...user,
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        phoneNumber: form.phoneNumber,
      };

      // ✅ update cookie so UI stays correct everywhere
      document.cookie = `user_data=${encodeURIComponent(
        JSON.stringify(updatedUser)
      )}; path=/; SameSite=Lax`;

      setUser(updatedUser);
      setIsError(false);
      setMessage("Profile updated successfully ✅");
    } catch (e) {
      console.error(e);
      setIsError(true);
      setMessage("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Photo upload (camera/gallery)
  const pickPhoto = () => {
    setMessage(null);
    setIsError(false);
    fileInputRef.current?.click();
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      setMessage(null);
      setIsError(false);

      const token = await getAuthToken();

      const fd = new FormData();
      fd.append("profileImage", file);

      // ✅ backend must support this endpoint
      const res = await fetch(`${API_BASE}/api/user/profile/image`, {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setIsError(true);
        setMessage(data?.message || "Failed to upload photo.");
        return;
      }

      const updatedUser: StoredUser = data?.data;

      document.cookie = `user_data=${encodeURIComponent(
        JSON.stringify(updatedUser)
      )}; path=/; SameSite=Lax`;

      setUser(updatedUser);
      setIsError(false);
      setMessage("Profile photo updated ✅");
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("Network error while uploading.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const logout = () => {
    deleteCookie("auth_token");
    deleteCookie("user_data");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Top bar - keep simple for admin */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 border-b border-orange-100 bg-white/90 backdrop-blur">
        <Link
          href="/admin/dashboard"
          className="text-2xl font-extrabold text-orange-700 tracking-wide"
        >
          Slice of Heaven <span className="text-sm font-semibold text-orange-900/50">Admin</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-bold text-orange-700 hover:bg-orange-50"
          >
            Dashboard
          </Link>

          <Link href="/admin/profile" className="flex items-center">
            <Image
              src="/profile.png"
              alt="Profile"
              width={44}
              height={44}
              className="rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-orange-500"
              priority
            />
          </Link>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="rounded-3xl bg-white border border-orange-100 shadow-sm p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="h-28 w-28 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center shadow">
                    <Image
                      src={absImg(user?.profileImage)}
                      alt="Admin"
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={uploadPhoto}
                  />

                  <button
                    type="button"
                    onClick={pickPhoto}
                    disabled={uploadingPhoto}
                    className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow hover:opacity-90 disabled:opacity-60"
                    title="Change photo"
                  >
                    {uploadingPhoto ? "…" : "✎"}
                  </button>
                </div>

                <div className="mt-4 text-xl font-extrabold text-orange-800">
                  {displayName}
                </div>
                <div className="mt-1 text-sm text-orange-900/60">
                  {user?.email || ""}
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("personal")}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold border ${
                    activeTab === "personal"
                      ? "bg-orange-50 border-orange-200 text-orange-800"
                      : "bg-white border-transparent text-orange-900/70 hover:bg-orange-50"
                  }`}
                >
                  👤 Personal Information
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("security")}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold border ${
                    activeTab === "security"
                      ? "bg-orange-50 border-orange-200 text-orange-800"
                      : "bg-white border-transparent text-orange-900/70 hover:bg-orange-50"
                  }`}
                >
                  🔒 Login & Password
                </button>

                {/* ❌ NO ORDERS LINK IN ADMIN */}

                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <section className="lg:col-span-9">
            <div className="rounded-3xl bg-white border border-orange-100 shadow-sm p-8">
              {message && (
                <div
                  className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
                    isError
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <div>
                <h2 className="text-2xl font-extrabold text-orange-800">
                  {activeTab === "personal"
                    ? "Personal Information"
                    : "Login & Password"}
                </h2>
                <p className="mt-1 text-sm text-orange-900/60">
                  Update your account details here.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                {activeTab === "personal" ? (
                  <>
                    <Field
                      label="Full Name"
                      value={form.fullName}
                      onChange={(v) => setForm((p) => ({ ...p, fullName: v }))}
                    />
                    <Field
                      label="Username"
                      value={form.username}
                      onChange={(v) => setForm((p) => ({ ...p, username: v }))}
                    />
                    <Field
                      label="Email"
                      value={form.email}
                      onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                      type="email"
                    />
                    <Field
                      label="Phone Number"
                      value={form.phoneNumber}
                      onChange={(v) =>
                        setForm((p) => ({ ...p, phoneNumber: v }))
                      }
                    />
                  </>
                ) : (
                  <>
                    <Field
                      label="Email"
                      value={form.email}
                      onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                      type="email"
                    />
                    <Field
                      label="Password"
                      value={form.password}
                      onChange={(v) => setForm((p) => ({ ...p, password: v }))}
                      type="password"
                      helper="Password is masked for security."
                    />
                  </>
                )}
              </div>

              <div className="mt-10 flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={discardChanges}
                  className="h-12 rounded-full border border-orange-300 px-8 text-sm font-semibold text-orange-800 hover:bg-orange-50"
                  disabled={saving}
                >
                  Discard Changes
                </button>

                <button
                  type="button"
                  onClick={saveChanges}
                  disabled={saving}
                  className="h-12 rounded-full bg-[#E39A3B] px-10 text-sm font-extrabold text-black hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-orange-900">Logout</h3>
            <p className="mt-2 text-sm text-orange-900/70">
              Are you sure you want to log out?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-11 rounded-xl border border-orange-200 text-orange-900 font-semibold hover:bg-orange-50"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white font-semibold hover:opacity-90"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  helper?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-orange-900/80">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        className="h-12 rounded-2xl border border-orange-200 bg-orange-50/40 px-4 text-sm text-orange-900 outline-none focus:ring-2 focus:ring-orange-300"
        placeholder={label}
      />
      {helper && <p className="text-xs text-orange-900/60">{helper}</p>}
    </div>
  );
}