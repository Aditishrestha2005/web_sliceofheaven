"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type StoredUser = {
  fullName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  profileImage?: string; // ✅ your admin profile uses this
  imageUrl?: string;     // ✅ fallback if backend uses this in some places
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

function absImg(path?: string) {
  if (!path) return "/profile.png";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export default function AdminProfileIcon() {
  const [me, setMe] = useState<StoredUser | null>(null);

  useEffect(() => {
    const raw = getCookie("user_data");
    if (!raw) return;

    try {
      const parsed: StoredUser = JSON.parse(raw);
      setMe(parsed);
    } catch {
      setMe(null);
    }
  }, []);

  const src = useMemo(() => {
    return absImg(me?.profileImage || me?.imageUrl);
  }, [me]);

  return (
    <Link href="/admin/profile" className="flex items-center">
      <Image
        src={src}
        alt="Profile"
        width={44}
        height={44}
        className="rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-orange-500"
        priority
      />
    </Link>
  );
}