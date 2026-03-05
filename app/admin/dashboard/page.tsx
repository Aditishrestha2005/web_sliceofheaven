import { cookies } from "next/headers";
import Link from "next/link";
import AdminProfileIcon from "../_components/AdminProfileIcon"; // ✅ ADDED

type User = {
  _id: string;
  fullName?: string;
  email: string;
  role: string;
  createdAt?: string;
};

type ApiUsersResponse =
  | User[]
  | {
      data?: User[];
      users?: User[];
      pagination?: any;
    };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function fetchAdminUsers(): Promise<User[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${API_BASE}/api/admin/users?page=1&size=200`, {
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

  const recentUsers = [...users]
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    })
    .slice(0, 3);

  return (
    // ✅ this wrapper forces full width even if parent layout is weird
    <section className="w-full min-w-0">
      <div className="w-full bg-orange-50 min-h-[calc(100vh-0px)]">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Header card */}
          <div className="rounded-3xl bg-white border border-orange-100 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-700 tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-sm sm:text-base text-orange-900/70">
                  Quick overview + shortcuts. Users management stays inside the Users page.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/admin/users"
                  className="rounded-2xl bg-orange-600 px-5 py-3 text-white font-semibold hover:bg-orange-700 transition text-center"
                >
                  Manage Users
                </Link>

                <Link
                  href="/admin/users/create"
                  className="rounded-2xl border border-orange-200 bg-white px-5 py-3 text-orange-700 font-semibold hover:bg-orange-50 transition text-center"
                >
                  + Create User
                </Link>

                <AdminProfileIcon /> {/* ✅ ADDED */}

           
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
              <p className="font-semibold">Couldn’t load dashboard data</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          ) : (
            <>
              {/* Stats row */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Users" value={totalUsers} />
                <StatCard title="Admins" value={adminCount} />
                <StatCard title="Customers" value={customerCount} />
              </div>

              {/* Two cards */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick actions */}
                <div className="rounded-3xl bg-white border border-orange-100 shadow-sm p-6">
                  <h2 className="text-xl font-extrabold text-orange-800">
                    Quick Actions
                  </h2>
                  <p className="mt-1 text-sm text-orange-900/60">
                    Go directly where you want.
                  </p>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ActionCard
                      title="Users Table"
                      desc="Search, paginate, edit, delete."
                      href="/admin/users"
                    />
                    <ActionCard
                      title="Create User"
                      desc="Add user + upload profile image."
                      href="/admin/users/create"
                    />
                  </div>

                </div>

                {/* Recent users small list */}
                <div className="rounded-3xl bg-white border border-orange-100 shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-orange-800">
                      Recent Users
                    </h2>
                    <Link
                      href="/admin/users"
                      className="text-sm font-semibold text-orange-700 hover:underline"
                    >
                      View all
                    </Link>
                  </div>

                  <p className="mt-1 text-sm text-orange-900/60">
                    Latest 3 accounts preview.
                  </p>

                  <div className="mt-4 space-y-3">
                    {recentUsers.length === 0 ? (
                      <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-900/70">
                        No users found.
                      </div>
                    ) : (
                      recentUsers.map((u) => (
                        <Link
                          key={u._id}
                          href={`/admin/users/${u._id}`}
                          className="block rounded-2xl border border-orange-100 hover:bg-orange-50 transition p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-orange-900 truncate">
                                {u.fullName || "—"}
                              </p>
                              <p className="text-xs text-orange-900/60 truncate">
                                {u.email}
                              </p>
                            </div>

                            <span
                              className={
                                "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold border " +
                                (u.role?.toLowerCase() === "admin"
                                  ? "bg-orange-100 text-orange-800 border-orange-200"
                                  : "bg-white text-orange-700 border-orange-200")
                              }
                            >
                              {u.role}
                            </span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white border border-orange-100 shadow-sm p-6">
      <p className="text-sm font-semibold text-orange-900/70">{title}</p>
      <p className="mt-2 text-4xl font-extrabold text-orange-700">{value}</p>
    </div>
  );
}

function ActionCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-orange-100 bg-white hover:bg-orange-50 transition p-5"
    >
      <p className="text-base font-extrabold text-orange-800">{title}</p>
      <p className="mt-2 text-sm text-orange-900/60">{desc}</p>
      <p className="mt-3 text-sm font-semibold text-orange-700">Open →</p>
    </Link>
  );
}