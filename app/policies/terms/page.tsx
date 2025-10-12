"use client";
export default function TermsPage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">الشروط والأحكام</h1>
        <p className="text-gray-700 leading-7">
          باستخدامك لمتجر <b>SalemForNet Shop</b> فأنت توافق على الشروط التالية. يُرجى قراءة البنود قبل إتمام الشراء.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">إنشاء الحساب</h2>
        <ul className="list-disc ps-6 text-gray-700 leading-7 space-y-1">
          <li>يلزم تقديم بيانات صحيحة والحفاظ على سرية معلومات الدخول.</li>
          <li>يُسمح بحساب واحد لكل مستخدم.</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">الطلبات والدفع</h2>
        <ul className="list-disc ps-6 text-gray-700 leading-7 space-y-1">
          <li>الأسعار بالعملة الموضّحة وتضم أو لا تضمّ ضريبة القيمة المضافة حسب البيان.</li>
          <li>إتمام الطلب يخضع للتوافر والتأكيد الهاتفي/البريدي إن لزم.</li>
          <li>وسائل الدفع المتاحة تُعرض بوضوح عند الإتمام.</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">الشحن والاستلام</h2>
        <p className="text-gray-700 leading-7">
          تُطبّق سياسة <a href="/help/shipping" className="text-accent">الشحن والتسليم</a>. يتحمل العميل مسؤولية صحة بيانات العنوان.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">الاستبدال والاسترجاع</h2>
        <p className="text-gray-700 leading-7">
          تُطبّق سياسة <a href="/help/returns" className="text-accent">الاستبدال والاسترجاع</a> خلال المدة المحددة وبالشروط المذكورة.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">الضمان</h2>
        <p className="text-gray-700 leading-7">
          تُطبّق سياسة <a href="/help/warranty" className="text-accent">الضمان</a> الخاصة بالوكيل/المُصنّع وفق الشروط.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">الاستخدام المقبول</h2>
        <ul className="list-disc ps-6 text-gray-700 leading-7 space-y-1">
          <li>يُحظر إساءة استخدام الموقع أو التحايل على أنظمة الشراء والدفع.</li>
          <li>يُحظر انتهاك حقوق الملكية الفكرية للمحتوى المعروض.</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">القانون والاختصاص</h2>
        <p className="text-gray-700 leading-7">
          تُفسَّر البنود وفق قوانين جمهورية مصر العربية، وأي نزاع يختص به القضاء المصري.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">التحديثات</h2>
        <p className="text-gray-700 leading-7">
          قد نقوم بتحديث الشروط والأحكام لتحسين الخدمة أو للامتثال. استمرار استخدامك يعني الموافقة على التعديلات.
        </p>
      </div>
    </div>
  );
}
