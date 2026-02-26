"use client";

import { useRouter } from "next/navigation";

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export default function AdminLogoutButton() {
  const router = useRouter();

  const logout = () => {
    // ✅ match your cookie names
    deleteCookie("auth_token");
    deleteCookie("user_data");

    // (optional) also clear localStorage if you ever used it
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-red-700 font-semibold hover:bg-red-100"
    >
      Logout
    </button>
  );
}
