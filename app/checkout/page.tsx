"use client";
import { useCart } from "@/components/cart/CartContext";
import { useState } from "react";
import data from "@/data/products.json";
import { egp } from "@/utils/currency";
import Link from "next/link";
import { firebaseEnabled, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/components/auth/AuthProvider";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const products = data as any[];
  const rows = items.map(i => ({...i, p: products.find(x=>x.id===i.id)})).filter(r=>r.p);
  const total = rows.reduce((a,r)=> a + r.qty * r.p.price_egp, 0);
  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddr] = useState("");
  const [status, setStatus] = useState<string|undefined>();
  const [orderRef, setOrderRef] = useState<string|undefined>();

  const submit = async () => {
    setStatus(undefined);
    if (rows.length===0) return;
    try {
      // حفظ في Firestore (لو مفعّل)
      let refId: string | undefined;
      if (firebaseEnabled) {
        const docRef = await addDoc(collection(db, "orders"), {
          user_id: user?.uid || null,
          guest_name: user ? null : name,
          guest_phone: user ? null : phone,
          address,
          total,
          status: "pending",
          payment_provider: "mock", // لاحقًا: paymob/fawry
          created_at: serverTimestamp(),
          items: rows.map(r => ({
            product_id: r.p.id,
            sku: r.p.sku,
            qty: r.qty,
            unit_price: r.p.price_egp
          }))
        });
        refId = docRef.id;
      }
      setOrderRef(refId || ("SFN-"+Date.now()));
      setStatus("success");
      clear();
    } catch (e) {
      console.error(e);
      setStatus("fail");
    }
  };

  if (rows.length===0) return <div className="card">السلة فارغة — <Link className="text-accent" href="/catalog">اذهب للكتالوج</Link></div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="font-semibold mb-3">بيانات الشحن</h2>
        <div className="space-y-3">
          {!user && <input placeholder="الاسم" value={name} onChange={e=>setName(e.target.value)} className="border rounded-2xl px-3 py-2 w-full"/>}
          {!user && <input placeholder="الهاتف" value={phone} onChange={e=>setPhone(e.target.value)} className="border rounded-2xl px-3 py-2 w-full"/>}
          <textarea placeholder="العنوان" value={address} onChange={e=>setAddr(e.target.value)} className="border rounded-2xl px-3 py-2 w-full"/>
          <button onClick={submit} className="bg-accent text-white px-4 py-2 rounded-2xl">دفع / تأكيد الطلب</button>
          {status==="success" && <div className="text-green-600">تم إنشاء الطلب بنجاح! {orderRef ? `رقم الطلب: ${orderRef}` : ""}</div>}
          {status==="fail" && <div className="text-red-600">حدث خطأ أثناء إنشاء الطلب.</div>}
          {firebaseEnabled ? <div className="text-xs text-gray-500">⦿ محفوظ في Firestore</div> : <div className="text-xs text-gray-500">ⓘ وضع تجريبي (بدون Firestore)</div>}
        </div>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-3">ملخص الطلب</h2>
        <ul className="space-y-2 text-sm">
          {rows.map(r=> <li key={r.id} className="flex justify-between"><span>{r.p.name_ar} × {r.qty}</span><span>{egp(r.qty*r.p.price_egp)}</span></li>)}
        </ul>
        <div className="mt-3 border-t pt-3 font-semibold">الإجمالي: {egp(total)}</div>
      </div>
    </div>
  );
}
