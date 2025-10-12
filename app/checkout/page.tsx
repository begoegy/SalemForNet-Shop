"use client";
import { useCart } from "@/components/cart/CartContext";
import { useState } from "react";
import data from "@/data/products.json";
import { egp } from "@/utils/currency";
import Link from "next/link";
import { firebaseEnabled, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type Errors = { name?: string; phone?: string; address?: string; city?: string };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const { user } = useAuth();
  const products = data as any[];
  const rows = items.map(i => ({...i, p: products.find(x=>x.id===i.id)})).filter(r=>r.p);
  const total = rows.reduce((a,r)=> a + r.qty * r.p.price_egp, 0);

  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("الجيزة");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle"|"saving"|"ok"|"fail">("idle");
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const e: Errors = {};
    if (!name || name.trim().length < 3) e.name = "ادخل اسم صحيح.";
    if (!/^[0-9+\-\s]{8,}$/.test(phone)) e.phone = "ادخل رقم هاتف صحيح.";
    if (!address || address.trim().length < 5) e.address = "ادخل عنوانًا صحيحًا.";
    if (!city) e.city = "اختر مدينة.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (rows.length === 0) return;
    if (!validate()) return;

    setStatus("saving");
    const order = {
      userId: user?.uid || null,
      name, phone, address, city, notes,
      items: rows.map(r => ({ id: r.id, qty: r.qty, price: r.p.price_egp })),
      total,
      createdAt: new Date().toISOString()
    };

    const saveToLocal = () => {
      try {
        const prev = JSON.parse(localStorage.getItem("orders") || "[]");
        prev.push(order);
        localStorage.setItem("orders", JSON.stringify(prev));
        return true;
      } catch {
        return false;
      }
    };

    try {
      if (firebaseEnabled && db) {
        await addDoc(collection(db, "orders"), { ...order, ts: serverTimestamp() });
      } else {
        saveToLocal();
      }
      setStatus("ok");
      clear();
      router.push("/orders");
    } catch (e) {
      console.error("Checkout Firestore error — falling back to localStorage:", e);
      const ok = typeof window !== "undefined" && saveToLocal();
      if (ok) {
        setStatus("ok");
        clear();
        router.push("/orders");
      } else {
        setStatus("fail");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-3 space-y-6">
        <div className="card">
          <h2 className="font-semibold mb-4">البيانات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">الاسم</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="border rounded-2xl px-3 py-2 w-full" placeholder="الاسم الكامل"/>
              {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
            </div>
            <div>
              <label className="text-sm">الهاتف</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} className="border rounded-2xl px-3 py-2 w-full" placeholder="01XXXXXXXXX"/>
              {errors.phone && <div className="text-red-600 text-xs mt-1">{errors.phone}</div>}
            </div>
            <div>
              <label className="text-sm">المدينة</label>
              <input value={city} onChange={e=>setCity(e.target.value)} className="border rounded-2xl px-3 py-2 w-full" placeholder="المدينة"/>
              {errors.city && <div className="text-red-600 text-xs mt-1">{errors.city}</div>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">العنوان</label>
              <input value={address} onChange={e=>setAddress(e.target.value)} className="border rounded-2xl px-3 py-2 w-full" placeholder="العنوان التفصيلي"/>
              {errors.address && <div className="text-red-600 text-xs mt-1">{errors.address}</div>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">ملاحظات</label>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="border rounded-2xl px-3 py-2 w-full" rows={3} placeholder="(اختياري)"/>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={submit} disabled={status==="saving"} className="bg-accent text-white px-4 py-2 rounded-2xl">
              {status==="saving" ? "جارٍ الحفظ..." : "إتمام العملية"}
            </button>
            <Link href="/cart" className="border px-4 py-2 rounded-2xl">رجوع للسلة</Link>
            {status==="ok" && <div className="text-green-600">تم إنشاء الطلب بنجاح.</div>}
            {status==="fail" && <div className="text-red-600">حدث خطأ أثناء إنشاء الطلب.</div>}
            {!firebaseEnabled && <div className="text-xs text-gray-500">ⓘ وضع تجريبي (بدون Firestore)</div>}
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-3">ملخص الطلب</h2>
        <ul className="space-y-2 text-sm">
          {rows.map(r=> (
            <li key={r.id} className="flex justify-between">
              <span>{r.p.name_ar} × {r.qty}</span>
              <span>{egp(r.qty*r.p.price_egp)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t pt-3 font-semibold">الإجمالي: {egp(total)}</div>
      </div>
    </div>
  );
}
