"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // نفس المكان اللي جاي منه AuthProvider

export default function AccountActions() {
  const { user, loading, signInGoogle, logout } = useAuth();

  if (loading) {
    return <span className="text-sm opacity-70">...جارٍ التحميل</span>;
  }

  if (user) {
    return (
      <>
        <Link
          href="/account"
          className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm font-semibold hover:bg-red-700 transition"
        >
          حسابي
        </Link>
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-md border text-sm font-semibold hover:bg-gray-100 transition"
        >
          خروج
        </button>
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="px-3 py-1.5 rounded-md border text-sm font-semibold hover:bg-gray-100 transition"
      >
        دخول
      </Link>
      <button
        onClick={signInGoogle}
        className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm font-semibold hover:bg-red-700 transition"
      >
        دخول بجوجل
      </button>
    </>
  );
}
