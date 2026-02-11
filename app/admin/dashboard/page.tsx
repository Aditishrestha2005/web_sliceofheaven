import { cookies } from "next/headers";
import Link from "next/link";

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
};

type ApiUsersResponse =
  | User[]
  | {
      data?: User[];
      users?: User[];
    };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function fetchAdminUsers(): Promise<User[]> {
  const cookieStore = await cookies();

  // ✅ correct cookie name used in your login: auth_token
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch users (${res.status}). ${text}`);
  }

  const data: ApiUsersResponse = await res.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any).data)) return (data as any).data;
  if (Array.isArray((data as any).users)) return (data as any).users;
  return [];
}

export default async function AdminDashboardPage() {
  let users: User[] = [];
  let error: string | null = null;

  try {
    users = await fetchAdminUsers();
  } catch (e: any) {
    error = e?.message || "Error fetching users";
  }

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role?.toLowerCase() === "admin").length;
  const customerCount = users.filter((u) => u.role?.toLowerCase() === "user").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-10">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-orange-700">
            Slice of Heaven — Admin Dashboard
          </h1>
          <p className="text-orange-900/70 mt-2">
            Manage users and platform access.
          </p>
        </div>

        <Link
          href="/admin/users"
          className="rounded-xl bg-orange-600 px-4 py-2 text-white font-semibold hover:opacity-90"
        >
          Manage Users
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard title="Total Users" value={totalUsers} />
            <StatCard title="Admins" value={adminCount} />
            <StatCard title="Customers" value={customerCount} />
          </div>

          <div className="rounded-3xl bg-white shadow-lg border border-orange-100 p-8">
            <h2 className="text-2xl font-extrabold text-orange-800 mb-3">
              Overview
            </h2>
            <p className="text-orange-900/70 leading-relaxed">
              Any user created from <strong>Admin → Users → Create</strong> will appear after refresh.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/admin/users/create"
                className="rounded-xl bg-orange-600 px-4 py-2 text-white font-semibold hover:opacity-90"
              >
                + Create User
              </Link>
              <Link
                href="/admin/users"
                className="rounded-xl border border-orange-300 px-4 py-2 text-orange-800 font-semibold hover:bg-orange-50"
              >
                View Users Table
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white border border-orange-100 shadow p-6">
      <h2 className="text-sm font-semibold text-orange-900/70">{title}</h2>
      <p className="mt-2 text-4xl font-extrabold text-orange-700">{value}</p>
    </div>
  );
}
