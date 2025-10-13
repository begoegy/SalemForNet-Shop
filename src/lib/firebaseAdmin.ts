// src/lib/firebaseAdmin.ts
import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function getDbOrNull() {
  try {
    if (!getApps().length) {
      const base64 = process.env.FIREBASE_ADMIN_BASE64;
      if (base64) {
        const json = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
        initializeApp({ credential: cert(json), projectId: process.env.FIREBASE_PROJECT_ID });
      } else {
        // يسمح بتشغيل بدون Admin
        initializeApp({ credential: applicationDefault(), projectId: process.env.FIREBASE_PROJECT_ID });
      }
    }
    return getFirestore();
  } catch {
    return null;
  }
}
