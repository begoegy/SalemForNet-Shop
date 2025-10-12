"use client";
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState<string|undefined>(); const router = useRouter();

  const login = async () => {
    setErr(undefined);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/account");
    } catch (e:any) { setErr(e.message); }
  };
  const loginGoogle = async () => {
    setErr(undefined);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/account");
    } catch (e:any) { setErr(e.message); }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-4">تسجيل الدخول</h1>
      <div className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="البريد" className="border rounded-2xl px-3 py-2 w-full"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="كلمة المرور" className="border rounded-2xl px-3 py-2 w-full"/>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button onClick={login} className="bg-dark text-white px-4 py-2 rounded-2xl w-full">دخول</button>
        <button onClick={loginGoogle} className="border px-4 py-2 rounded-2xl w-full">دخول بـ Google</button>
        <div className="text-sm flex justify-between">
          <Link href="/register" className="text-accent">إنشاء حساب</Link>
          <Link href="/reset" className="text-accent">نسيت كلمة المرور؟</Link>
        </div>
      </div>
    </div>
  );
}
