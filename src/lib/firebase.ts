// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJFgArPoyst8u1ilcYOrtelrG0xU3vpHk",
  authDomain: "salemfornet-29b08.firebaseapp.com",
  projectId: "salemfornet-29b08",
  storageBucket: "salemfornet-29b08.appspot.com",
  messagingSenderId: "493070658543",
  appId: "1:493070658543:web:ebb8bfb4c76d258d53e41a",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ✅ علشان صفحة checkout تقدر تعرف إذا هنكتب على Firestore ولا وضع تجريبي
export const firebaseEnabled = process.env.NEXT_PUBLIC_FIREBASE_ENABLED === "true";
