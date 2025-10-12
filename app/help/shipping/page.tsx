"use client";
export default function HelpShipping() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">الشحن والتسليم</h1>
        <p className="text-gray-700 leading-7">نوفّر شحنًا سريعًا لجميع المحافظات داخل مصر. يتم تجهيز الطلب خلال يوم عمل واحد، ومدة التوصيل عادةً من 1–3 أيام عمل حسب موقعك.</p>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">تكلفة الشحن</h2>
        <ul className="list-disc ps-6 text-gray-700 leading-7 space-y-1">
          <li>داخل القاهرة والجيزة: من 45 إلى 70 ج.م حسب الوزن والمنطقة.</li>
          <li>للمحافظات: من 70 إلى 120 ج.م حسب شركة الشحن والوزن.</li>
          <li>شحن مجاني للطلبات الأكبر من قيمة محددة نعلن عنها على الصفحة الرئيسية عند توافر عروض.</li>
        </ul>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">متابعة الشحنة</h2>
        <p className="text-gray-700 leading-7">سنرسل لك رسالة تأكيد على البريد مع رقم التتبع (إن وجد). يمكنك التواصل معنا في أي وقت للاستفسار عن حالة الطلب.</p>
      </div>
    </div>
  );
}
