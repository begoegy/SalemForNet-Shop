"use client";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

export default function ResetPage() {
  const [email, setEmail] = useState(""); const [msg, setMsg] = useState<string|undefined>(); const [err, setErr] = useState<string|undefined>();
  const send = async () => {
    setMsg(undefined); setErr(undefined);
    try { await sendPasswordResetEmail(auth, email); setMsg("تم إرسال رابط إعادة التعيين إلى بريدك."); }
    catch (e:any) { setErr(e.message); }
  };
  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-4">استعادة كلمة المرور</h1>
      <div className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="البريد" className="border rounded-2xl px-3 py-2 w-full"/>
        <button onClick={send} className="bg-dark text-white px-4 py-2 rounded-2xl w-full">إرسال</button>
        {msg && <div className="text-green-600 text-sm">{msg}</div>}
        {err && <div className="text-red-600 text-sm">{err}</div>}
      </div>
    </div>
  );
}
