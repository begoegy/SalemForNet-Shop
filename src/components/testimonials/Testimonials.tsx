"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { firebaseEnabled, db } from "@/lib/firebase";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";

type Review = { id?: string; user_name?: string|null; rating: number; text: string; created_at?: any };

const fallback: Review[] = [
  { rating: 5, text: "خدمة ممتازة والتسليم سريع، المنتجات أصلية.", user_name: "عمرو" },
  { rating: 4, text: "أسعار كويسة ودعم فني محترم.", user_name: "محمود" },
  { rating: 5, text: "اشتريت EAP245 شغال زي الفل.", user_name: "حازم" }
];

function Stars({ n }: { n: number }) {
  return (
    <div className="text-yellow-500" aria-label={`Rating: ${n} of 5`}>
      {"★★★★★".slice(0, n)}<span className="text-gray-300">{"★★★★★".slice(n)}</span>
    </div>
  );
}

export default function Testimonials() {
  const { user } = useAuth();
  const [list, setList] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const canSubmit = useMemo(()=> Boolean(user && text.trim() && rating>=1 && rating<=5), [user, text, rating]);

  const load = async () => {
    setLoading(true);
    try {
      if (firebaseEnabled) {
        const q = query(collection(db, "reviews"), orderBy("created_at", "desc"));
        const snap = await getDocs(q);
        const arr: Review[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        setList(arr.length ? arr : fallback);
      } else {
        setList(fallback);
      }
    } catch {
      setList(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> { load(); }, []);

  const submit = async () => {
    if (!canSubmit) return;
    try {
      if (firebaseEnabled) {
        await addDoc(collection(db, "reviews"), {
          user_id: user?.uid,
          user_name: user?.displayName || user?.email?.split("@")[0] || "مستخدم",
          rating,
          text,
          created_at: serverTimestamp()
        });
      }
      setText("");
      setRating(5);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        {loading ? <div className="card">جاري التحميل…</div> :
          list.slice(0,6).map((r, i) => (
            <div className="card" key={r.id || i}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.user_name || "عميل"}</div>
                <Stars n={r.rating} />
              </div>
              <p className="text-sm text-gray-700 mt-2 leading-6">{r.text}</p>
            </div>
          ))
        }
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">أضف رأيك</h3>
        {user ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">مسجّل الدخول كـ: <span className="font-medium">{user.displayName || user.email}</span></div>
            <div className="flex items-center gap-2">
              <label className="text-sm">التقييم:</label>
              <select value={rating} onChange={(e)=>setRating(parseInt(e.target.value))} className="border rounded-2xl px-3 py-2">
                {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
              <Stars n={rating} />
            </div>
            <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="اكتب رأيك..." className="border rounded-2xl px-3 py-2 w-full min-h-[120px]" />
            <button disabled={!canSubmit} onClick={submit} className={`px-4 py-2 rounded-2xl ${canSubmit ? "bg-accent text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}>
              نشر التقييم
            </button>
            {!firebaseEnabled && <div className="text-xs text-gray-500">ⓘ الوضع التجريبي: يتم العرض من بيانات افتراضية. فعّل Firebase لحفظ التقييمات.</div>}
          </div>
        ) : (
          <div className="text-sm">
            يجب تسجيل الدخول لإضافة رأيك. <a className="text-accent underline" href="/login">تسجيل الدخول</a>
          </div>
        )}
      </div>
    </div>
  );
}
