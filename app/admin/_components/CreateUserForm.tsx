// "use client";

// import { Controller, SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRef, useState, useTransition } from "react";
// import { toast } from "react-toastify";

// import { UserSchema, UserFormValues } from "@/app/admin/users/schema";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// function getCookie(name: string) {
//   const part = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith(`${name}=`));
//   return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
// }

// export default function CreateUserForm() {
//   const [pending, startTransition] = useTransition();

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<UserFormValues>({
//     resolver: zodResolver(UserSchema),
//     defaultValues: {
//       role: "user",
//       fullName: "",
//       username: "",
//       email: "",
//       phoneNumber: "",
//       password: "",
//       confirmPassword: "",
//       image: undefined,
//     },
//   });

//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleImageChange = (
//     file: File | undefined,
//     onChange: (value: any) => void
//   ) => {
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreviewImage(reader.result as string);
//       reader.readAsDataURL(file);
//     } else {
//       setPreviewImage(null);
//     }
//     onChange(file);
//   };

//   const clearImage = (onChange?: (value: any) => void) => {
//     setPreviewImage(null);
//     onChange?.(undefined);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // ✅ Correct handler type now
//   const onSubmit: SubmitHandler<UserFormValues> = (data) => {
//     startTransition(() => {
//       (async () => {
//         try {
//           const token = getCookie("auth_token");
//           if (!token) throw new Error("Not logged in (missing auth_token)");

//           const fd = new FormData();
//           fd.append("fullName", data.fullName);
//           fd.append("username", data.username);
//           fd.append("email", data.email);
//           fd.append("phoneNumber", data.phoneNumber);
//           fd.append("password", data.password);
//           fd.append("confirmPassword", data.confirmPassword);

//           // role can be undefined in INPUT type, so fallback
//           fd.append("role", data.role ?? "user");

//           if (data.image) {
//             fd.append("profilePicture", data.image as File);
//           }

//           const res = await fetch(`${API_BASE}/api/admin/users`, {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//             body: fd,
//           });

//           const raw = await res.text();
//           let json: any = null;
//           try {
//             json = raw ? JSON.parse(raw) : null;
//           } catch {}

//           if (!res.ok) {
//             throw new Error(json?.message || raw || `Failed (${res.status})`);
//           }

//           toast.success("User created ✅");
//           reset();
//           clearImage();
//         } catch (err: any) {
//           toast.error(err?.message || "Create user failed");
//         }
//       })();
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       {/* Image */}
//       <div>
//         {previewImage ? (
//           <div className="relative w-24 h-24">
//             <img
//               src={previewImage}
//               alt="Preview"
//               className="w-24 h-24 rounded-full object-cover"
//             />
//             <Controller
//               name="image"
//               control={control}
//               render={({ field: { onChange } }) => (
//                 <button
//                   type="button"
//                   onClick={() => clearImage(onChange)}
//                   className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6"
//                 >
//                   ✕
//                 </button>
//               )}
//             />
//           </div>
//         ) : (
//           <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
//             <span className="text-orange-700 text-xs font-semibold">No Image</span>
//           </div>
//         )}
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Profile Picture</label>
//         <Controller
//           name="image"
//           control={control}
//           render={({ field: { onChange } }) => (
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept=".jpg,.jpeg,.png,.webp"
//               onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
//             />
//           )}
//         />
//       </div>

//       <div>
//         <label className="text-sm font-medium">Full Name</label>
//         <input className="w-full border px-3 py-2 rounded" {...register("fullName")} />
//         {errors.fullName && <p className="text-xs text-red-600">{String(errors.fullName.message)}</p>}
//       </div>

//       <div>
//         <label className="text-sm font-medium">Username</label>
//         <input className="w-full border px-3 py-2 rounded" {...register("username")} />
//         {errors.username && <p className="text-xs text-red-600">{String(errors.username.message)}</p>}
//       </div>

//       <div>
//         <label className="text-sm font-medium">Email</label>
//         <input type="email" className="w-full border px-3 py-2 rounded" {...register("email")} />
//         {errors.email && <p className="text-xs text-red-600">{String(errors.email.message)}</p>}
//       </div>

//       <div>
//         <label className="text-sm font-medium">Phone Number</label>
//         <input className="w-full border px-3 py-2 rounded" {...register("phoneNumber")} />
//         {errors.phoneNumber && (
//           <p className="text-xs text-red-600">{String(errors.phoneNumber.message)}</p>
//         )}
//       </div>

//       <div>
//         <label className="text-sm font-medium">Role</label>
//         <select className="w-full border px-3 py-2 rounded" {...register("role")}>
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//       </div>

//       <div>
//         <label className="text-sm font-medium">Password</label>
//         <input type="password" className="w-full border px-3 py-2 rounded" {...register("password")} />
//         {errors.password && <p className="text-xs text-red-600">{String(errors.password.message)}</p>}
//       </div>

//       <div>
//         <label className="text-sm font-medium">Confirm Password</label>
//         <input
//           type="password"
//           className="w-full border px-3 py-2 rounded"
//           {...register("confirmPassword")}
//         />
//         {errors.confirmPassword && (
//           <p className="text-xs text-red-600">{String(errors.confirmPassword.message)}</p>
//         )}
//       </div>

//       <button
//         type="submit"
//         disabled={isSubmitting || pending}
//         className="w-full bg-orange-600 text-white py-2 rounded disabled:opacity-60"
//       >
//         {isSubmitting || pending ? "Creating..." : "Create User"}
//       </button>
//     </form>
//   );
// }

"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";

import { UserSchema, UserFormValues } from "@/app/admin/users/schema";
import { API } from "@/lib/api/endpoint";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

export default function CreateUserForm() {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      role: "user",
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      image: undefined,
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    file: File | undefined,
    onChange: (value: any) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const clearImage = (onChange?: (value: any) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit: SubmitHandler<UserFormValues> = (data) => {
    startTransition(() => {
      (async () => {
        try {
          const token = getCookie("auth_token");
          if (!token) throw new Error("Not logged in (missing auth_token)");

          const fd = new FormData();
          fd.append("fullName", data.fullName);
          fd.append("username", data.username);
          fd.append("email", data.email);
          fd.append("phoneNumber", data.phoneNumber);
          fd.append("password", data.password);
          fd.append("confirmPassword", data.confirmPassword);
          fd.append("role", data.role ?? "user");

          // ✅ backend expects uploads.single("image")
          if (data.image) {
            fd.append("image", data.image as File);
          }

          const res = await fetch(`${API_BASE}${API.ADMIN.USERS}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          });

          const raw = await res.text();
          let json: any = null;
          try {
            json = raw ? JSON.parse(raw) : null;
          } catch {}

          if (!res.ok) {
            throw new Error(json?.message || raw || `Failed (${res.status})`);
          }

          toast.success("User created ✅");
          reset();
          clearImage();
        } catch (err: any) {
          toast.error(err?.message || "Create user failed");
        }
      })();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Image */}
      <div>
        {previewImage ? (
          <div className="relative w-24 h-24">
            <img
              src={previewImage}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover"
            />
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange } }) => (
                <button
                  type="button"
                  onClick={() => clearImage(onChange)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6"
                >
                  ✕
                </button>
              )}
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-700 text-xs font-semibold">No Image</span>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Profile Picture</label>
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
            />
          )}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Full Name</label>
        <input className="w-full border px-3 py-2 rounded" {...register("fullName")} />
        {errors.fullName && (
          <p className="text-xs text-red-600">{String(errors.fullName.message)}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Username</label>
        <input className="w-full border px-3 py-2 rounded" {...register("username")} />
        {errors.username && (
          <p className="text-xs text-red-600">{String(errors.username.message)}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Email</label>
        <input type="email" className="w-full border px-3 py-2 rounded" {...register("email")} />
        {errors.email && (
          <p className="text-xs text-red-600">{String(errors.email.message)}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Phone Number</label>
        <input className="w-full border px-3 py-2 rounded" {...register("phoneNumber")} />
        {errors.phoneNumber && (
          <p className="text-xs text-red-600">{String(errors.phoneNumber.message)}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Role</label>
        <select className="w-full border px-3 py-2 rounded" {...register("role")}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Password</label>
        <input type="password" className="w-full border px-3 py-2 rounded" {...register("password")} />
        {errors.password && (
          <p className="text-xs text-red-600">{String(errors.password.message)}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">{String(errors.confirmPassword.message)}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full bg-orange-600 text-white py-2 rounded disabled:opacity-60"
      >
        {isSubmitting || pending ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
