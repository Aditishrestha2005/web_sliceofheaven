import Link from "next/link";

export default function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow border border-orange-100">
        <h1 className="text-2xl font-extrabold text-orange-700">
          User Detail (Dummy)
        </h1>

        <p className="mt-3 text-orange-900">
          User ID: <span className="font-bold">{id}</span>
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/admin/users"
            className="rounded-xl border border-orange-200 px-4 py-2 text-sm font-semibold hover:bg-orange-50"
          >
            ← Back
          </Link>

          <Link
            href={`/admin/users/${id}/edit`}
            className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Edit User
          </Link>
        </div>
      </div>
    </div>
  );
}
