"use client";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); const [err, setErr] = useState<string|undefined>();
  const router = useRouter();

  const register = async () => {
    setErr(undefined);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      router.push("/account");
    } catch (e:any) { setErr(e.message); }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-4">إنشاء حساب</h1>
      <div className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="الاسم" className="border rounded-2xl px-3 py-2 w-full"/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="البريد" className="border rounded-2xl px-3 py-2 w-full"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="كلمة المرور" className="border rounded-2xl px-3 py-2 w-full"/>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button onClick={register} className="bg-accent text-white px-4 py-2 rounded-2xl w-full">تسجيل</button>
        <div className="text-sm text-center">
          لديك حساب؟ <Link href="/login" className="text-accent">سجّل الدخول</Link>
        </div>
      </div>
    </div>
  );
}
