"use client";
export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">سياسة الخصوصية</h1>
        <p className="text-gray-700 leading-7">
          نلتزم بحماية خصوصيتك. عند استخدامك لمتجر <b>SalemForNet Shop</b>، قد نجمع بعض البيانات الأساسية
          بهدف تنفيذ الطلبات وتحسين الخدمة. لا نبيع بياناتك لطرف ثالث.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">البيانات التي نجمعها</h2>
        <ul className="list-disc ps-6 text-gray-700 leading-7 space-y-1">
          <li>معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف (عند التسجيل أو إتمام الطلب).</li>
          <li>معلومات الشحن: العنوان، المدينة، وسيلة التواصل لتسليم الطلب.</li>
          <li>بيانات فنية أساسية: مثل نوع الجهاز والمتصفح لأغراض أمنية وتحليلية.</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">كيف نستخدم البيانات</h2>
        <ul className="list-disc ps-6 text-gray-700 leading-7 space-y-1">
          <li>تنفيذ الطلبات والدفع وخدمة ما بعد البيع (الضمان/الاستبدال).</li>
          <li>التواصل معك بشأن حالة الطلب والعروض ذات الصلة (عند موافقتك).</li>
          <li>تحسين تجربة المستخدم، واكتشاف الاحتيال وحماية الحسابات.</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">مشاركة البيانات</h2>
        <p className="text-gray-700 leading-7">
          قد نشارك الحد الأدنى من البيانات مع مزوّدي الخدمات الضروريين (شركة الشحن، بوابة الدفع) لإتمام خدمتك فقط.
          لا يتم بيع أو تأجير بياناتك لأي طرف.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">حقوقك</h2>
        <ul className="list-disc ps-6 text-gray-700 leading-7 space-y-1">
          <li>الاطلاع على بياناتك وتحديثها أو طلب حذفها وفق القوانين المعمول بها.</li>
          <li>إلغاء الاشتراك في الرسائل التسويقية في أي وقت.</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">الأمان والاحتفاظ بالبيانات</h2>
        <p className="text-gray-700 leading-7">
          نطبّق ممارسات تقنية وتنظيمية لحماية بياناتك، ونحتفظ بها للمدة اللازمة لتقديم الخدمة والامتثال للقانون.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">التحديثات والتواصل</h2>
        <p className="text-gray-700 leading-7">
          قد نحدّث هذه السياسة من وقت لآخر. سنعرض تاريخ آخر تحديث بوضوح. لأي استفسار: <a href="/contact" className="text-accent">تواصل معنا</a>.
        </p>
      </div>
    </div>
  );
}
