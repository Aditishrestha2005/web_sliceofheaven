"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type StoredUser = {
  fullName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  imageUrl?: string; // ✅ backend field
};

type TabKey = "personal" | "security";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const BACKEND_UPDATE_PROFILE_URL = `${API_BASE}/api/auth/update-profile`;

function getCookie(name: string) {
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

function setUserCookie(updatedUser: StoredUser) {
  document.cookie = `user_data=${encodeURIComponent(
    JSON.stringify(updatedUser)
  )}; path=/; SameSite=Lax`;
}

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();

  const fileRef = useRef<HTMLInputElement | null>(null);

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
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName = useMemo(
    () => user?.fullName || user?.username || "User",
    [user]
  );

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
      console.error("Profile load error:", e);
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

  const submitProfileToBackend = async (opts?: { file?: File | null }) => {
    const token = getCookie("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fd = new FormData();

    fd.append("fullName", form.fullName);
    fd.append("username", form.username);
    fd.append("email", form.email);
    fd.append("phoneNumber", form.phoneNumber);

    if (opts?.file) {
      fd.append("profilePicture", opts.file); // ✅ backend expects this field name
    }

    const res = await fetch(BACKEND_UPDATE_PROFILE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "Profile update failed");
    }

    const updatedUser: StoredUser = data?.data;

    setUser(updatedUser);
    setUserCookie(updatedUser);

    setIsError(false);
    setMessage("Profile updated successfully.");
  };

  const saveChanges = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);
    setIsError(false);

    try {
      await submitProfileToBackend();
    } catch (e: any) {
      console.error(e);
      setIsError(true);
      setMessage(e?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const onPickAvatar = () => fileRef.current?.click();

  const onAvatarSelected = async (file: File | null) => {
    if (!file || !user) return;

    setUploading(true);
    setMessage(null);
    setIsError(false);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      const MAX = 4 * 1024 * 1024;
      if (file.size > MAX) {
        throw new Error("Image too large. Max 4MB.");
      }

      await submitProfileToBackend({ file });
    } catch (e: any) {
      console.error(e);
      setIsError(true);
      setMessage(e?.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const logout = () => {
    deleteCookie("auth_token");
    deleteCookie("user_data");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/register");
  };

  const profileImageSrc =
    user?.imageUrl ? `${API_BASE}${user.imageUrl}` : "/profile.png";

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 border-b border-orange-200 bg-[#FFF7EE]/90 backdrop-blur">
        <Link
          href="/home"
          className="text-3xl font-extrabold text-orange-600 tracking-wide"
        >
          Slice of Heaven
        </Link>

        <nav className="hidden md:flex gap-14 text-sm font-semibold text-orange-700">
          <Link href="/home" className="hover:underline">
            Home
          </Link>
          <Link href="/home" className="hover:underline">
            About us
          </Link>
          <Link href="/dashboard" className="hover:underline">
            Menu
          </Link>
          <Link href="/home" className="hover:underline">
            Contact
          </Link>
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            type="button"
            aria-label="Cart"
            className="w-11 h-11 rounded-full border border-orange-200 bg-white flex items-center justify-center hover:bg-orange-50 transition"
            onClick={() => router.push("/dashboard")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-orange-600"
            >
              <path
                d="M6 6h15l-2 9H7L6 6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M6 6 5 3H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="9"
                cy="21"
                r="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="21"
                r="1"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>

          {/* ✅ Navbar Profile uses backend image now */}
          <Link href="/user/profile" className="flex items-center">
            <img
              src={profileImageSrc}
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-orange-500"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/profile.png";
              }}
            />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="h-[calc(100vh-72px)] w-full px-6 py-6">
          <div className="h-full w-full grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            <aside className="lg:col-span-3 h-full">
              <div className="h-full rounded-3xl bg-white shadow-lg border border-orange-100 p-6 flex flex-col">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    {/* ✅ Sidebar profile uses backend image now (img not Next Image) */}
                    <div className="h-28 w-28 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center shadow">
                      <img
                        src={profileImageSrc}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/profile.png";
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow hover:opacity-90 disabled:opacity-60"
                      title="Edit photo"
                      onClick={onPickAvatar}
                      disabled={uploading}
                    >
                      {uploading ? "…" : "✎"}
                    </button>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) =>
                        onAvatarSelected(e.target.files?.[0] || null)
                      }
                    />
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

                  <Link
                    href="/orders"
                    className={`block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold border ${
                      pathname === "/orders"
                        ? "bg-orange-50 border-orange-200 text-orange-800"
                        : "bg-white border-transparent text-orange-900/70 hover:bg-orange-50"
                    }`}
                  >
                    📦 My Orders
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    🚪 Logout
                  </button>
                </div>

                <div className="flex-1" />
              </div>
            </aside>

            <section className="lg:col-span-9 h-full">
              <div className="h-full rounded-3xl bg-white shadow-lg border border-orange-100 p-8 flex flex-col">
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
                        helper="Password update not implemented in backend yet."
                      />
                    </>
                  )}
                </div>

                <div className="flex-1" />

                <div className="mt-10 flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={discardChanges}
                    className="h-12 rounded-full border border-orange-300 px-8 text-sm font-semibold text-orange-800 hover:bg-orange-50"
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