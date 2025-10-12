"use client";
export default function HelpReturns() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">الاستبدال والاسترجاع</h1>
        <p className="text-gray-700 leading-7">يمكنك استبدال أو استرجاع المنتج خلال 14 يومًا من تاريخ الاستلام بشرط سلامة التغليف وجميع الملحقات والفاتورة.</p>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">شروط الاستبدال/الاسترجاع</h2>
        <ul className="list-disc ps-6 text-gray-700 leading-7 space-y-1">
          <li>أن يكون المنتج غير مستخدم وبدون خدوش أو كسور.</li>
          <li>الاحتفاظ بعلبة المنتج الأصلية وكافة الملحقات.</li>
          <li>في حال عيب صناعة، نلتزم بالإصلاح أو الاستبدال وفق تقرير الضمان.</li>
        </ul>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">طريقة الطلب</h2>
        <p className="text-gray-700 leading-7">راسلنا عبر صفحة <a href="/contact" className="text-accent">تواصل معنا</a> مع رقم الطلب وصور توضح الحالة، وسنرتّب الاستلام عبر شركة الشحن.</p>
      </div>
    </div>
  );
}
