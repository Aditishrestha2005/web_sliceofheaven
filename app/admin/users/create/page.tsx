// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// function getCookie(name: string) {
//   const part = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith(`${name}=`));
//   return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
// }

// export default function AdminCreateUserPage() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     fullName: "",
//     username: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     role: "user",
//   });

//   const [profilePicture, setProfilePicture] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const token = getCookie("auth_token");
//       if (!token) {
//         setError("No auth token found. Please login again.");
//         router.push("/login");
//         return;
//       }

//       // ✅ Multer => FormData (even if no image)
//       const data = new FormData();
//       data.append("fullName", form.fullName);
//       data.append("username", form.username);
//       data.append("email", form.email);
//       data.append("phoneNumber", form.phoneNumber);
//       data.append("password", form.password);
//       data.append("confirmPassword", form.confirmPassword);
//       data.append("role", form.role);

//       // ✅ IMPORTANT: your backend route expects "profilePicture"
//       if (profilePicture) data.append("profilePicture", profilePicture);

//       const res = await fetch(`${API_BASE}/api/admin/users`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`, // ✅ THIS FIXES JWT INVALID
//           // ❌ do not set Content-Type for FormData
//         },
//         body: data,
//       });

//       const raw = await res.text();
//       let json: any = null;
//       try {
//         json = raw ? JSON.parse(raw) : null;
//       } catch {}

//       if (!res.ok) {
//         throw new Error(json?.message || raw || "Failed to create user");
//       }

//       router.push("/admin/users");
//       router.refresh();
//     } catch (err: any) {
//       setError(err?.message || "Error creating user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center p-6">
//       <div className="w-full max-w-xl bg-white rounded-2xl shadow p-8">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-orange-700">Create User</h2>
//           <Link
//             href="/admin/users"
//             className="text-sm px-3 py-1 rounded-lg border hover:shadow"
//           >
//             ← Back
//           </Link>
//         </div>

//         {error && (
//           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block mb-1 font-medium">Full Name</label>
//             <input
//               type="text"
//               name="fullName"
//               value={form.fullName}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded text-gray-900 bg-white"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Username</label>
//             <input
//               type="text"
//               name="username"
//               value={form.username}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded text-gray-900 bg-white"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded text-gray-900 bg-white"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Phone Number</label>
//             <input
//               type="tel"
//               name="phoneNumber"
//               value={form.phoneNumber}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded text-gray-900 bg-white"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded text-gray-900 bg-white"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Confirm Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={form.confirmPassword}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded text-gray-900 bg-white"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Role</label>
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded text-gray-900 bg-white"
//             >
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">
//               Profile Picture (optional)
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
//               className="w-full"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? "Creating..." : "Create User"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API } from "@/lib/api/endpoint";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

export default function AdminCreateUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getCookie("auth_token");
      if (!token) {
        setError("No auth token found. Please login again.");
        router.push("/login");
        return;
      }

      const data = new FormData();
      data.append("fullName", form.fullName);
      data.append("username", form.username);
      data.append("email", form.email);
      data.append("phoneNumber", form.phoneNumber);
      data.append("password", form.password);
      data.append("confirmPassword", form.confirmPassword);
      data.append("role", form.role);

      // backend expects uploads.single("image")
      if (image) data.append("image", image);

      const res = await fetch(`${API_BASE}${API.ADMIN.USERS}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const raw = await res.text();
      let json: any = null;
      try {
        json = raw ? JSON.parse(raw) : null;
      } catch {}

      if (!res.ok) {
        throw new Error(json?.message || raw || "Failed to create user");
      }

      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="mx-auto max-w-5xl px-6 pt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-700">
              Create User
            </h1>
            <p className="mt-1 text-sm text-orange-900/60">
              Add a new user from the admin panel.
            </p>
          </div>

          <Link
            href="/admin/users"
            className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-800 hover:bg-orange-50"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-6">
        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-orange-900">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Rohan Sharma"
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-orange-900">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="e.g. rohan123"
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-orange-900">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. rohan@gmail.com"
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-orange-900">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="e.g. 9800000000"
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-orange-900">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-orange-900">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-type password"
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-orange-900">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-orange-900">
                Profile Picture (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-600 file:px-3 file:py-1.5 file:text-white file:hover:bg-orange-700"
              />
              <p className="mt-2 text-xs text-orange-900/60">
                Upload field name is <span className="font-semibold">image</span> (matches your backend).
              </p>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Link
                href="/admin/users"
                className="rounded-xl border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-orange-800 hover:bg-orange-50 text-center"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
