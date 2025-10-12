"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const go = () => {
    const qp = q ? `?q=${encodeURIComponent(q)}` : "";
    router.push(`/catalog${qp}`);
  };
  return (
    <div className="flex w-full max-w-2xl rounded-2xl border overflow-hidden">
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        onKeyDown={(e)=>{ if (e.key === "Enter") go(); }}
        placeholder="ابحث عن راوتر / Access Point / سويتش / كابل..."
        className="px-4 py-3 w-full outline-none"
      />
      <button onClick={go} className="bg-accent text-white px-5 font-semibold">بحث</button>
    </div>
  );
}
