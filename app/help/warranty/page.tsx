"use client";
export default function HelpWarranty() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">الضمان</h1>
        <p className="text-gray-700 leading-7">جميع المنتجات مغطاة بضمان الوكيل/المُصنِّع داخل مصر لمدة تختلف حسب الفئة (عادةً 12 شهرًا). يحتفظ العميل بالفاتورة كإثبات.</p>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">يشمل الضمان</h2>
        <ul className="list-disc ps-6 text-gray-700 leading-7 space-y-1">
          <li>عيوب الصناعة أو الأعطال غير الناتجة عن سوء الاستخدام.</li>
          <li>دعم فني للمساعدة في التشخيص قبل تحويل المنتج لمركز الصيانة.</li>
        </ul>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">غير مشمول</h2>
        <ul className="list-disc ps-6 text-gray-700 leading-7 space-y-1">
          <li>الكسر، الحريق، الرطوبة، أو التعديلات غير المعتمدة.</li>
          <li>الاكسسوارات الاستهلاكية (كابلات مقطوعة، إلخ) ما لم يثبت عيب الصناعة.</li>
        </ul>
      </div>
    </div>
  );
}
