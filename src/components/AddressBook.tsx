"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Address = {
  id?: string;
  fullName: string;
  phone: string;
  city: string;
  street: string;
  notes?: string;
  isDefault?: boolean;
  createdAt?: any;
};

export default function AddressBook({ uid }: { uid: string }) {
  const [items, setItems] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  const colRef = useMemo(
    () => collection(db, "users", uid, "addresses"),
    [uid]
  );

  useEffect(() => {
    const q = query(colRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr: Address[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Address),
        }));
        setItems(arr);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [colRef]);

  async function saveAddress(a: Address) {
    setSaving(true);
    setError(null);
    try {
      // لو اختار Default خلّي باقي العناوين مش Default
      if (a.isDefault) {
        await Promise.all(
          items
            .filter((x) => x.id && x.id !== a.id && x.isDefault)
            .map((x) => updateDoc(doc(colRef, x.id!), { isDefault: false }))
        );
      }

      if (a.id) {
        await updateDoc(doc(colRef, a.id), {
          fullName: a.fullName,
          phone: a.phone,
          city: a.city,
          street: a.street,
          notes: a.notes || "",
          isDefault: !!a.isDefault,
        });
      } else {
        const payload = {
          fullName: a.fullName,
          phone: a.phone,
          city: a.city,
          street: a.street,
          notes: a.notes || "",
          isDefault: !!a.isDefault || items.length === 0, // أول عنوان يبقى افتراضي
          createdAt: serverTimestamp(),
        };
        await addDoc(colRef, payload);
      }
      setEditing(null);
    } catch (e: any) {
      setError(e.message || "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function removeAddress(id?: string) {
    if (!id) return;
    if (!confirm("هل تريد حذف هذا العنوان؟")) return;
    setError(null);
    try {
      await deleteDoc(doc(colRef, id));
    } catch (e: any) {
      setError(e.message || "تعذّر الحذف");
    }
  }

  async function makeDefault(id?: string) {
    if (!id) return;
    setError(null);
    try {
      // ألغِ الافتراضي من الباقي
      await Promise.all(
        items
          .filter((x) => x.id && x.id !== id && x.isDefault)
          .map((x) => updateDoc(doc(colRef, x.id!), { isDefault: false }))
      );
      await updateDoc(doc(colRef, id), { isDefault: true });
    } catch (e: any) {
      setError(e.message || "تعذّر التعيين كافتراضي");
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">العناوين</h2>
        <button
          onClick={() =>
            setEditing({
              fullName: "",
              phone: "",
              city: "",
              street: "",
              notes: "",
              isDefault: items.length === 0,
            })
          }
          className="px-3 py-1.5 rounded-2xl bg-dark text-white text-sm"
        >
          + إضافة عنوان
        </button>
      </div>

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

      {loading ? (
        <div className="text-sm text-gray-600">جار التحميل…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-600">لا توجد عناوين بعد.</div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="border rounded-2xl p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {a.fullName}{" "}
                  {a.isDefault && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                      افتراضي
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!a.isDefault && (
                    <button
                      onClick={() => makeDefault(a.id)}
                      className="text-xs border px-2 py-1 rounded-2xl"
                    >
                      جعل افتراضي
                    </button>
                  )}
                  <button
                    onClick={() => setEditing(a)}
                    className="text-xs border px-2 py-1 rounded-2xl"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => removeAddress(a.id)}
                    className="text-xs border px-2 py-1 rounded-2xl text-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-1">
                <div>الهاتف: {a.phone || "—"}</div>
                <div>المدينة: {a.city || "—"}</div>
                <div>العنوان: {a.street || "—"}</div>
                {a.notes ? <div>ملاحظات: {a.notes}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* النموذج (إضافة/تعديل) */}
      {editing && (
        <AddressForm
          value={editing}
          onCancel={() => setEditing(null)}
          onSubmit={saveAddress}
          saving={saving}
        />
      )}
    </>
  );
}

function AddressForm({
  value,
  onSubmit,
  onCancel,
  saving,
}: {
  value: Address;
  onSubmit: (a: Address) => void | Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Address>(value);

  function bind<K extends keyof Address>(key: K) {
    return {
      value: (form[key] as any) ?? "",
      onChange: (e: any) =>
        setForm((s) => ({ ...s, [key]: e.target.value as any })),
    };
  }

  return (
    <div className="mt-4 border rounded-2xl p-3">
      <h3 className="font-medium mb-2">
        {form.id ? "تعديل العنوان" : "إضافة عنوان"}
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600">الاسم الكامل</label>
          <input
            className="w-full border rounded-2xl px-3 py-2"
            placeholder="مثال: أحمد علي"
            {...bind("fullName")}
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">الهاتف</label>
          <input
            className="w-full border rounded-2xl px-3 py-2"
            placeholder="01xxxxxxxxx"
            {...bind("phone")}
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">المدينة</label>
          <input
            className="w-full border rounded-2xl px-3 py-2"
            placeholder="القاهرة"
            {...bind("city")}
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">العنوان التفصيلي</label>
          <input
            className="w-full border rounded-2xl px-3 py-2"
            placeholder="الحي/الشارع/العلامة المميزة"
            {...bind("street")}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-600">ملاحظات</label>
          <input
            className="w-full border rounded-2xl px-3 py-2"
            placeholder="اختياري"
            value={form.notes || ""}
            onChange={(e) =>
              setForm((s) => ({ ...s, notes: e.target.value || "" }))
            }
          />
        </div>
        <div className="flex items-center gap-2 md:col-span-2">
          <input
            id="isDefault"
            type="checkbox"
            checked={!!form.isDefault}
            onChange={(e) =>
              setForm((s) => ({ ...s, isDefault: e.target.checked }))
            }
          />
          <label htmlFor="isDefault" className="text-sm">
            تعيين كعنوان افتراضي
          </label>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          disabled={saving}
          onClick={() => onSubmit(form)}
          className="px-4 py-2 rounded-2xl bg-dark text-white disabled:opacity-60"
        >
          {saving ? "جار الحفظ…" : "حفظ"}
        </button>
        <button onClick={onCancel} className="px-4 py-2 rounded-2xl border">
          إلغاء
        </button>
      </div>
    </div>
  );
}
