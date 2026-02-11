import { cookies } from "next/headers";
import Link from "next/link";

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
};

type ApiResponse =
  | { data?: User; user?: User; message?: string }
  | User;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function fetchUserById(id: string): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch user (${res.status}). ${text}`);
  }

  const json: ApiResponse = await res.json();

  // support multiple backend shapes
  if ("_id" in (json as any)) return json as User;
  if ((json as any).data?._id) return (json as any).data as User;
  if ((json as any).user?._id) return (json as any).user as User;

  return null;
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  let user: User | null = null;
  let error: string | null = null;

  try {
    user = await fetchUserById(id);
  } catch (e: any) {
    error = e?.message || "Error fetching user";
  }

  return (
    <div className="p-8 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-xl shadow min-h-[60vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-orange-700">Customer Detail</h1>

        <Link
          href="/admin/users"
          className="px-4 py-2 rounded-lg bg-white shadow hover:shadow-md border text-gray-700"
        >
          ← Back to Users
        </Link>
      </div>

      {error ? (
        <div className="text-center py-10 text-red-600 font-medium">{error}</div>
      ) : !user ? (
        <div className="text-center py-10 text-gray-600">User not found.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-orange-500 max-w-xl mx-auto">
          <div className="mb-5">
            <div className="text-sm font-semibold text-gray-500 mb-1">User ID</div>
            <div className="font-mono bg-orange-50 px-3 py-2 rounded text-orange-800">
              {user._id}
            </div>
          </div>

          <div className="space-y-3">
            <Row label="Name" value={user.fullName} />
            <Row label="Email" value={user.email} />
            <div className="flex items-center gap-3">
              <div className="font-semibold text-gray-700 w-20">Role</div>
              <span
                className={
                  user.role?.toLowerCase() === "admin"
                    ? "text-green-700 font-bold"
                    : "text-amber-700 font-bold"
                }
              >
                {user.role?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/admin/users/${user._id}/edit`}
              className="px-4 py-2 rounded-lg bg-orange-600 text-white shadow hover:shadow-md"
            >
              Edit User
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="font-semibold text-gray-700 w-20">{label}</div>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}
