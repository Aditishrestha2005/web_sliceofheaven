// "use client";

// import Link from "next/link";

// const dummyUsers = [
//   { id: "1", fullName: "John Doe", email: "john@example.com", role: "user" },
//   { id: "2", fullName: "Admin User", email: "admin@example.com", role: "admin" },
//   { id: "3", fullName: "Jane Smith", email: "jane@example.com", role: "user" },
// ];

// export default function AdminUsersPage() {
//   return (
//     <div className="min-h-screen bg-orange-50 p-8">
//       <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow border border-orange-100">
//         <div className="flex items-center justify-between gap-4">
//           <h1 className="text-2xl font-extrabold text-orange-700">
//             Users (Admin)
//           </h1>

//           <Link
//             href="/admin/users/create"
//             className="rounded-xl bg-orange-600 px-4 py-2 text-white font-semibold hover:opacity-90"
//           >
//             + Create User
//           </Link>
//         </div>

//         <p className="mt-2 text-sm text-orange-900/60">
//           Dummy table for sprint requirement. API + pagination will be integrated next.
//         </p>

//         <div className="mt-6 overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="text-left text-sm text-orange-900/70">
//                 <th className="py-3 border-b">ID</th>
//                 <th className="py-3 border-b">Full Name</th>
//                 <th className="py-3 border-b">Email</th>
//                 <th className="py-3 border-b">Role</th>
//                 <th className="py-3 border-b">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {dummyUsers.map((u) => (
//                 <tr key={u.id} className="text-sm">
//                   <td className="py-3 border-b">{u.id}</td>
//                   <td className="py-3 border-b">{u.fullName}</td>
//                   <td className="py-3 border-b">{u.email}</td>
//                   <td className="py-3 border-b">{u.role}</td>
//                   <td className="py-3 border-b">
//                     <div className="flex gap-4">
//                       <Link
//                         href={`/admin/users/${u.id}`}
//                         className="text-orange-700 font-semibold hover:underline"
//                       >
//                         View
//                       </Link>

//                       <Link
//                         href={`/admin/users/${u.id}/edit`}
//                         className="text-blue-700 font-semibold hover:underline"
//                       >
//                         Edit
//                       </Link>

//                       <button
//                         type="button"
//                         className="text-red-600 font-semibold hover:underline"
//                         onClick={() => {
//                           const ok = window.confirm(`Delete user ${u.id}?`);
//                           if (ok) alert("Dummy delete");
//                         }}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Dummy pagination */}
//         <div className="mt-6 flex items-center justify-between text-sm">
//           <span className="text-orange-900/70">Page 1 of 1</span>
//           <div className="flex gap-2">
//             <button className="rounded-lg border px-3 py-1 opacity-60 cursor-not-allowed">
//               Prev
//             </button>
//             <button className="rounded-lg border px-3 py-1 opacity-60 cursor-not-allowed">
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { API } from "@/lib/api/endpoint";

type User = {
  _id: string;
  email: string;
  username: string;
  fullName?: string;
  phoneNumber?: string;
  role: "user" | "admin";
  createdAt?: string;
};

type UsersResponse = {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
  message: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(7);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<UsersResponse["pagination"]>({
    page: 1,
    size: 7,
    totalItems: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("size", String(size));
    if (search.trim()) sp.set("search", search.trim());
    return sp.toString();
  }, [page, size, search]);

  async function fetchUsers() {
    setLoading(true);
    setErr(null);

    try {
      const token = getCookie("auth_token");
      if (!token) throw new Error("No auth token found.");

      const res = await fetch(`${API_BASE}${API.ADMIN.USERS}?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = (await res.json()) as UsersResponse;

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to fetch users");
      }

      setUsers(data.data);
      setPagination(data.pagination);
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [query]);

  async function deleteUser(id: string) {
    if (!confirm("Delete this user?")) return;

    try {
      const token = getCookie("auth_token");
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}${API.ADMIN.USERS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      fetchUsers();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow-lg border border-orange-200 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-orange-700">Users</h1>
            <p className="text-gray-600">
              Total Users: {pagination.totalItems}
            </p>
          </div>

          <Link
            href="/admin/users/create"
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            + Create User
          </Link>
        </div>

        {/* SEARCH + SIZE */}
        <div className="flex gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 text-gray-900 focus:ring-2 focus:ring-orange-300 outline-none"
          />

          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
          >
            {[5, 7, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-orange-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Username</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-900 text-sm">
              {loading && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-600">
                    Loading...
                  </td>
                </tr>
              )}

              {err && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-red-600">
                    {err}
                  </td>
                </tr>
              )}

              {!loading &&
                !err &&
                users.map((u, index) => (
                  <tr
                    key={u._id}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-white" : "bg-orange-50"
                    } hover:bg-orange-100 transition`}
                  >
                    <td className="p-3 font-mono text-xs">{u._id}</td>
                    <td className="p-3">{u.fullName || "-"}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.username}</td>
                    <td className="p-3">{u.phoneNumber || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 flex gap-3">
                      <Link
                        href={`/admin/users/${u._id}`}
                        className="text-orange-700 font-medium hover:underline"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/users/${u._id}/edit`}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteUser(u._id)}
                        className="text-red-600 font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-700">
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="border px-3 py-1 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

