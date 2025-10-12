'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = useMemo(() => params.get('returnTo') || '/account', [params]);

  const [mode, setMode] = useState<Mode>('register'); // نبدأ بـ "إنشاء حساب" لو حابب
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // لو مسجّل بالفعل، حوّله مباشرة
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace(returnTo);
    });
    return () => unsub();
  }, [router, returnTo]);

  async function ensureUserDoc(uid: string, data: any) {
    await setDoc(
      doc(db, 'users', uid),
      {
        ...data,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await signInWithEmailAndPassword(auth, email, pass);
        await ensureUserDoc(res.user.uid, {
          email: res.user.email,
          displayName: res.user.displayName || name || '',
          phone: res.user.phoneNumber || phone || '',
        });
      } else {
        // register
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        if (name) {
          await updateProfile(res.user, { displayName: name });
        }
        await ensureUserDoc(res.user.uid, {
          email,
          displayName: name,
          phone,
        });
      }
      router.push(returnTo);
    } catch (e: any) {
      setErr(e?.message ?? 'حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setErr(null);
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await ensureUserDoc(res.user.uid, {
        email: res.user.email,
        displayName: res.user.displayName || '',
        phone: res.user.phoneNumber || '',
      });
      router.push(returnTo);
    } catch (e: any) {
      setErr(e?.message ?? 'فشل الدخول عبر Google');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] w-full flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6 space-y-5">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </h1>
          <p className="text-sm text-neutral-600">
            {mode === 'login'
              ? 'مرحبًا بعودتك!'
              : 'املأ البيانات لإنشاء حساب وإتمام الطلبات'}
          </p>
        </div>

        {/* تبديل الوضع */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-100 p-1">
          <button
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg text-sm font-medium ${
              mode === 'login' ? 'bg-white shadow' : 'opacity-70'
            }`}
          >
            دخول
          </button>
          <button
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg text-sm font-medium ${
              mode === 'register' ? 'bg-white shadow' : 'opacity-70'
            }`}
          >
            إنشاء حساب
          </button>
        </div>

        {err && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={onEmailSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-sm">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                  placeholder="الاسم كما سيظهر في الطلبات"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm">رقم الموبايل</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                  placeholder="01xxxxxxxxx"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-sm">الإيميل</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">كلمة المرور</label>
            <input
              type="password"
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-2 font-medium disabled:opacity-60"
          >
            {loading
              ? mode === 'login'
                ? 'جاري تسجيل الدخول...'
                : 'جاري إنشاء الحساب...'
              : mode === 'login'
              ? 'تسجيل الدخول'
              : 'إنشاء حساب'}
          </button>
        </form>

        {/* فاصل */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-neutral-500">أو</span>
          </div>
        </div>

        <button
          onClick={onGoogle}
          disabled={loading}
          className="w-full rounded-lg border py-2 font-medium hover:bg-neutral-50 disabled:opacity-60"
        >
          {mode === 'login' ? 'الدخول بواسطة Google' : 'التسجيل بواسطة Google'}
        </button>

        <p className="text-xs text-neutral-500 text-center">
          سيتم تحويلك بعد النجاح إلى: <b className="break-all">{returnTo}</b>
        </p>
      </div>
    </main>
  );
}
