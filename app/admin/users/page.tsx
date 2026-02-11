"use client";

import Link from "next/link";

const dummyUsers = [
  { id: "1", fullName: "John Doe", email: "john@example.com", role: "user" },
  { id: "2", fullName: "Admin User", email: "admin@example.com", role: "admin" },
  { id: "3", fullName: "Jane Smith", email: "jane@example.com", role: "user" },
];

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow border border-orange-100">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-orange-700">
            Users (Admin)
          </h1>

          <Link
            href="/admin/users/create"
            className="rounded-xl bg-orange-600 px-4 py-2 text-white font-semibold hover:opacity-90"
          >
            + Create User
          </Link>
        </div>

        <p className="mt-2 text-sm text-orange-900/60">
          Dummy table for sprint requirement. API + pagination will be integrated next.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-orange-900/70">
                <th className="py-3 border-b">ID</th>
                <th className="py-3 border-b">Full Name</th>
                <th className="py-3 border-b">Email</th>
                <th className="py-3 border-b">Role</th>
                <th className="py-3 border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {dummyUsers.map((u) => (
                <tr key={u.id} className="text-sm">
                  <td className="py-3 border-b">{u.id}</td>
                  <td className="py-3 border-b">{u.fullName}</td>
                  <td className="py-3 border-b">{u.email}</td>
                  <td className="py-3 border-b">{u.role}</td>
                  <td className="py-3 border-b">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-orange-700 font-semibold hover:underline"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/users/${u.id}/edit`}
                        className="text-blue-700 font-semibold hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="text-red-600 font-semibold hover:underline"
                        onClick={() => {
                          const ok = window.confirm(`Delete user ${u.id}?`);
                          if (ok) alert("Dummy delete");
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dummy pagination */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-orange-900/70">Page 1 of 1</span>
          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1 opacity-60 cursor-not-allowed">
              Prev
            </button>
            <button className="rounded-lg border px-3 py-1 opacity-60 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
