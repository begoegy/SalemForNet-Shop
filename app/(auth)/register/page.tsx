// Server Component — بدون useSearchParams
import Link from "next/link";

type SearchParams = { [key: string]: string | string[] | undefined };

// نمنع تصدير ثابت للصفحة عشان ما يحاولش يعمل prerender
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RegisterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // اقرأ ?ref= من URL
  const ref = typeof searchParams?.ref === "string" ? searchParams.ref : "";

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">إنشاء حساب</h1>

      {ref ? (
        <p className="mb-4 text-sm text-gray-600">
          كود الإحالة: <span className="font-semibold">{ref}</span>
        </p>
      ) : null}

      <form className="space-y-4" action="/api/register" method="post">
        <input type="hidden" name="ref" value={ref} />

        <div>
          <label className="block mb-1 text-sm">الاسم الكامل</label>
          <input name="fullName" className="w-full border rounded-md p-2" required />
        </div>

        <div>
          <label className="block mb-1 text-sm">البريد الإلكتروني</label>
          <input type="email" name="email" className="w-full border rounded-md p-2" required />
        </div>

        <div>
          <label className="block mb-1 text-sm">رقم الموبايل</label>
          <input type="tel" name="phone" className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block mb-1 text-sm">كلمة المرور</label>
          <input type="password" name="password" className="w-full border rounded-md p-2" minLength={6} required />
        </div>

        <button type="submit" className="w-full rounded-md p-2 border bg-black text-white">
          إنشاء الحساب
        </button>
      </form>

      <div className="mt-4 text-sm">
        لديك حساب بالفعل؟{" "}
        <Link className="underline" href="/login">
          تسجيل الدخول
        </Link>
      </div>
    </main>
  );
}
