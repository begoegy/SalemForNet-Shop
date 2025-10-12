"use client";
import { useRouter } from "next/navigation";

const cats = [
  { key: "راوترات", label: "راوترات", icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M3 6h18v12H3zM5 9h4v2H5zm0 4h4v2H5zm6-4h8v2h-8zm0 4h8v2h-8z"/></svg>
  )},
  { key: "Access Point", label: "Access Point", icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M12 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-10a6 6 0 0 0-12 0h2a4 4 0 1 1 8 0h2Zm4 0A10 10 0 0 0 2 10h2a8 8 0 1 1 16 0h2Z"/></svg>
  )},
  { key: "سويتشات", label: "سويتشات", icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M3 6h18v12H3zM5 9h4v2H5zm0 4h4v2H5zm6-4h8v2h-8zm0 4h8v2h-8z"/></svg>
  )},
  { key: "كابلات", label: "كابلات", icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M7 7h3v3H7zm7 7h3v3h-3zM4 4h6v6H4zm10 10h6v6h-6zM9 13l2 2 4-4"/></svg>
  )},
  { key: "أدوات", label: "أدوات", icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M7 14l-4 4l3 3l4-4l-3-3Zm2-2l8-8l2 2l-8 8H9Zm9-9l2 2l1-1l-2-2l-1 1Z"/></svg>
  )},
  { key: "طاقة", label: "طاقة", icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M11 21h2l6-10h-5l1-8l-8 12h4z"/></svg>
  )},
  { key: "SFP", label: "SFP", icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M3 12l6-6l6 6l-6 6l-6-6Zm9 0l6-6l3 3l-6 6z"/></svg>
  )},
  { key: "CPE", label: "CPE", icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M12 2l7 4v12l-7 4l-7-4V6z"/></svg>
  )}
];

export default function Categories() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cats.map(c => (
        <button
          key={c.key}
          onClick={()=> router.push(`/catalog?cat=${encodeURIComponent(c.key)}`)}
          className="border rounded-2xl px-3 py-3 flex items-center gap-2 hover:border-accent hover:shadow-soft transition"
        >
          <span className="text-gray-700">{c.icon}</span>
          <span className="text-sm font-medium">{c.label}</span>
        </button>
      ))}
    </div>
  );
}
