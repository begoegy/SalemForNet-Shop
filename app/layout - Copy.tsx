// app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SalemForNet",
  description: "Shop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col bg-[#f7f8fb] text-gray-900">
        <AuthProvider>
          {/* ======= Header ======= */}
          <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto h-14 px-4 flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow">
                  S
                </span>
                <span className="font-semibold text-gray-800 text-lg">SalemForNet</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-700">
                <Link href="/" className="hover:text-indigo-600">الرئيسية</Link>
                <Link href="/products" className="hover:text-indigo-600">المنتجات</Link>
                <Link href="/offers" className="hover:text-indigo-600">العروض</Link>
                <Link href="/contact" className="hover:text-indigo-600">تواصل معنا</Link>
              </nav>

              {/* Account button */}
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
              >
                حسابي
              </Link>
            </div>
          </header>

          {/* ======= Main content ======= */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>

          {/* ======= Footer ======= */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
