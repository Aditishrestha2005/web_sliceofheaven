"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoint";

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "male",
    role: "user",
  });

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`${API.ADMIN.USER}/${id}`);

        const fetchedUser = res.data.data || res.data.user || res.data;

        if (fetchedUser) {
          setFormData({
            fullName: fetchedUser.fullName || "",
            email: fetchedUser.email || "",
            phone: fetchedUser.phone || "",
            gender: fetchedUser.gender || "male",
            role: fetchedUser.role || "user",
          });

          if (fetchedUser.profilePicture) {
            const baseUrl =
              (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
            const picPath = fetchedUser.profilePicture.startsWith("/")
              ? fetchedUser.profilePicture
              : `/${fetchedUser.profilePicture}`;

            setPreview(`${baseUrl}${picPath}?t=${Date.now()}`);
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ REQUIRED: FormData for multer update endpoint
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("gender", formData.gender);
    data.append("role", formData.role);
    if (file) data.append("profilePicture", file);

    try {
      await axiosInstance.put(`${API.ADMIN.USER}/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      alert("Failed to update user.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-orange-600 font-bold animate-pulse text-xl">
          Loading user...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 p-6">
      <button onClick={() => router.back()} className="text-sm mb-4 underline">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Edit User: {id}</h1>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center relative">
            {preview ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-6xl font-black">?</div>
            )}

            <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center cursor-pointer text-white">
              <span className="text-sm font-bold">Change Photo</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
