"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-[#111] text-gray-300 border-t border-gray-800">
      {/* ======= Top CTA band ======= */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col md:flex-row items-center gap-3 md:gap-6">
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-lg md:text-xl font-semibold">
              محتاج مساعدة في اختيار المنتج المناسب؟
            </h3>
            <p className="text-white/90 text-sm mt-0.5">
              فريق الدعم جاهز يرد عليك خلال دقائق على الواتساب أو البريد.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="https://wa.me/201033256630"
              className="rounded-xl bg-white text-red-700 px-4 py-2 text-sm font-semibold shadow hover:bg-gray-100 transition"
            >
              تواصل واتساب
            </Link>
            <Link
              href="mailto:support@salemfornet.art"
              className="rounded-xl border border-white/70 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
            >
              ابعت لنا إيميل
            </Link>
          </div>
        </div>
      </div>

      {/* ======= Main content ======= */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand + brief */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white font-bold shadow-sm">
                S
              </span>
              <span className="font-semibold text-lg text-white">SalemForNet</span>
            </div>
            <p className="mt-3 text-sm text-gray-400 leading-6">
              متجر حلول شبكات احترافية: راوترات، نقاط وصول، سويتشات، كابلات، أدوات
              وسلطات طاقة — شحن سريع، دعم فني، وضمان حقيقي.
            </p>

            {/* Social */}
            <div className="mt-4 flex items-center gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="h-9 w-9 rounded-xl border border-gray-600 grid place-items-center hover:bg-red-600 hover:text-white"
                title="Facebook"
              >
                <span className="font-bold">f</span>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="h-9 w-9 rounded-xl border border-gray-600 grid place-items-center hover:bg-red-600 hover:text-white"
                title="Instagram"
              >
                <span className="font-bold">IG</span>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="h-9 w-9 rounded-xl border border-gray-600 grid place-items-center hover:bg-red-600 hover:text-white"
                title="YouTube"
              >
                <span className="font-bold">▶</span>
              </a>
            </div>
          </div>

          {/* Shopping */}
          <div>
            <h4 className="font-semibold text-white">التسوق</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-red-500">
                  كل المنتجات
                </Link>
              </li>
              <li>
                <Link href="/category/routers" className="hover:text-red-500">
                  راوترات
                </Link>
              </li>
              <li>
                <Link href="/category/access-points" className="hover:text-red-500">
                  Access Point
                </Link>
              </li>
              <li>
                <Link href="/category/switches" className="hover:text-red-500">
                  سويتشات
                </Link>
              </li>
              <li>
                <Link href="/category/cables" className="hover:text-red-500">
                  كابلات وإكسسوارات
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white">الدعم</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/help/shipping" className="hover:text-red-500">
                  الشحن والتسليم
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="hover:text-red-500">
                  الاستبدال والاسترجاع
                </Link>
              </li>
              <li>
                <Link href="/help/warranty" className="hover:text-red-500">
                  الضمان
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-500">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-white">الحساب</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/account" className="hover:text-red-500">
                  حسابي
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-red-500">
                  طلباتي
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-red-500">
                  المفضلة
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-red-500">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px w-full bg-gray-700" />

        {/* Contact + Payments */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="text-sm text-gray-400">
            <p>
              الهاتف:{" "}
              <a href="tel:01122201212" className="hover:text-red-500">
                01122201212
              </a>{" "}
              — واتساب:{" "}
              <a href="https://wa.me/201033256630" className="hover:text-red-500">
                01033256630
              </a>
            </p>
            <p className="mt-1">
              البريد:{" "}
              <a href="mailto:support@salemfornet.art" className="hover:text-red-500">
                support@salemfornet.art
              </a>
            </p>
          </div>

          {/* Payment Badges */}
          <div className="flex flex-wrap justify-start md:justify-end gap-2">
            {["Visa", "Mastercard", "Meeza", "Vodafone Cash", "Fawry"].map((p) => (
              <span
                key={p}
                className="inline-flex items-center rounded-lg border border-gray-600 px-2.5 py-1.5 text-xs font-semibold bg-[#1a1a1a] shadow-sm hover:border-red-500 transition"
                title={p}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ======= Bottom bar ======= */}
      <div className="border-t border-gray-800 bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row items-center gap-3 md:gap-6">
          <p className="text-xs text-gray-500">
            © {year}{" "}
            <span className="font-semibold text-white">SalemForNet</span> — جميع الحقوق محفوظة.
          </p>
          <nav className="md:ms-auto flex items-center gap-4 text-xs text-gray-500">
            <Link href="/policy/privacy" className="hover:text-red-500">
              سياسة الخصوصية
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/policy/terms" className="hover:text-red-500">
              الشروط والأحكام
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
