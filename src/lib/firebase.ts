// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ اقرا كل القيم من المتغيرات (Vercel / .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  // اختيارية لو مفعّل Analytics
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 🔒 فحص مريح وقت التطوير لو في قيمة ناقصة
if (process.env.NODE_ENV !== "production") {
  for (const [k, v] of Object.entries(firebaseConfig)) {
    if (v === undefined || v === "" || v === null) {
      // eslint-disable-next-line no-console
      console.warn(`[firebase] Missing env var: ${k}`);
    }
  }
}

// ✅ ممنوع نعيد التهيئة أكتر من مرة
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🧩 Exports موحدة لباقي المشروع
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// مزوّد الدخول بجوجل (يفتح اختيار الحساب)
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// ✅ فلاغ لتفعيل/تعطيل الكتابة على Firestore من الواجهة
// لو عايز تعطّل الكتابة في البيئة التجريبية: NEXT_PUBLIC_FIREBASE_ENABLED=false
export const firebaseEnabled =
  (process.env.NEXT_PUBLIC_FIREBASE_ENABLED ?? "true").toLowerCase() === "true";

export default app;
