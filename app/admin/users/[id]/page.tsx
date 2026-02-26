// import Link from "next/link";

// export default function AdminUserDetailPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const { id } = params;

//   return (
//     <div className="min-h-screen bg-orange-50 p-8">
//       <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow border border-orange-100">
//         <h1 className="text-2xl font-extrabold text-orange-700">
//           User Detail (Dummy)
//         </h1>

//         <p className="mt-3 text-orange-900">
//           User ID: <span className="font-bold">{id}</span>
//         </p>

//         <div className="mt-6 flex gap-3">
//           <Link
//             href="/admin/users"
//             className="rounded-xl border border-orange-200 px-4 py-2 text-sm font-semibold hover:bg-orange-50"
//           >
//             ← Back
//           </Link>

//           <Link
//             href={`/admin/users/${id}/edit`}
//             className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
//           >
//             Edit User
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API } from "@/lib/api/endpoint";

type User = {
  _id: string;
  email: string;
  username: string;
  fullName?: string;
  phoneNumber?: string;
  role: "user" | "admin";
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

type UserResponse = {
  success: boolean;
  data: User;
  message?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams(); // ✅ Next 16 safe
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const token = getCookie("auth_token");
        if (!token) throw new Error("No auth token found. Please login as admin.");

        const res = await fetch(`${API_BASE}${API.ADMIN.USERS}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const raw = await res.text();
        let json: any = null;
        try {
          json = raw ? JSON.parse(raw) : null;
        } catch {}

        if (!res.ok) throw new Error(json?.message || raw || "Failed to fetch user");
        if (!json?.success) throw new Error(json?.message || "Failed to fetch user");

        setUser(json.data);
      } catch (e: any) {
        setErr(e?.message || "Something went wrong");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-orange-50 p-8 text-gray-900">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow border border-orange-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-orange-700">User Detail</h1>
            <p className="mt-1 text-sm text-gray-600">View user information</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-xl border border-orange-200 px-4 py-2 text-sm font-semibold hover:bg-orange-50"
            >
              ← Back
            </button>

            {id && (
              <Link
                href={`/admin/users/${id}/edit`}
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Edit User
              </Link>
            )}
          </div>
        </div>

        {loading && <p className="mt-6 text-sm text-gray-600">Loading…</p>}

        {!loading && err && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        )}

        {!loading && !err && user && (
          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-xl bg-orange-50 p-4 border border-orange-100">
              <p className="text-gray-600">User ID</p>
              <p className="font-semibold text-gray-900 break-all">{user._id}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard label="Full Name" value={user.fullName || "—"} />
              <InfoCard label="Role" value={user.role} />
              <InfoCard label="Email" value={user.email} />
              <InfoCard label="Username" value={user.username} />
              <InfoCard label="Phone" value={user.phoneNumber || "—"} />
              <InfoCard
                label="Created At"
                value={user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
              />
            </div>

            {user.imageUrl && (
              <div className="mt-3 rounded-xl border p-4">
                <p className="text-gray-600 mb-2">Profile Image</p>
                <img
                  src={`${API_BASE}${user.imageUrl}`}
                  alt="profile"
                  className="h-28 w-28 rounded-xl object-cover border"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-gray-600">{label}</p>
      <p className="font-semibold text-gray-900 break-words">{value}</p>
    </div>
  );
}

