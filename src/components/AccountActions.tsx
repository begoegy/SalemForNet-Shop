"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";

export default function AccountActions() {
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  const doLogout = async () => {
    try {
      setBusy(true);
      await signOut(auth);
    } finally {
      setBusy(false);
    }
  };

  const signInGoogle = async () => {
    try {
      setBusy(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <span className="text-sm opacity-70">...جارٍ التحميل</span>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/account"
          className="px-3 py-1.5 rounded-md border text-sm font-semibold hover:bg-gray-100 transition"
        >
          حسابي
        </Link>
        <button
          onClick={doLogout}
          disabled={busy}
          className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
        >
          {busy ? "جارٍ الخروج..." : "تسجيل الخروج"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="px-3 py-1.5 rounded-md border text-sm font-semibold hover:bg-gray-100 transition"
      >
        دخول
      </Link>
      <Link
        href="/register"
        className="px-3 py-1.5 rounded-md border text-sm font-semibold hover:bg-gray-100 transition"
      >
        تسجيل
      </Link>
      <button
        onClick={signInGoogle}
        disabled={busy}
        className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-60"
      >
        دخول بجوجل
      </button>
    </div>
  );
}
