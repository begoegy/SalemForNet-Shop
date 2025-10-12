"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-4">تواصل معنا</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <input placeholder="الاسم" value={name} onChange={e=>setName(e.target.value)} className="border rounded-xl px-3 py-2 w-full"/>
          <input placeholder="البريد" value={email} onChange={e=>setEmail(e.target.value)} className="border rounded-xl px-3 py-2 w-full"/>
          <textarea placeholder="رسالتك" value={msg} onChange={e=>setMsg(e.target.value)} className="border rounded-xl px-3 py-2 w-full"/>
          <button onClick={()=>setSent(true)} className="bg-dark text-white px-4 py-2 rounded-xl">إرسال</button>
          {sent && <div className="text-green-600">تم الإرسال (تجريبي).</div>}
        </div>
        <div className="rounded-2xl overflow-hidden">
          <iframe
            title="map"
            className="w-full h-64 md:h-full"
            src="https://maps.google.com/maps?q=Badrasheen%20Giza&t=&z=13&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
