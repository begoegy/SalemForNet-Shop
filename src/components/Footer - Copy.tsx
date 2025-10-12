export default function Footer() {
  return (
    <footer className="border-t mt-12 bg-white">
      <div className="sf-container py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-extrabold">SalemForNet <span className="text-accent">Shop</span></div>
          <p className="text-sm text-gray-700 mt-2 leading-6">
            متجر متخصص في بيع وتوريد إكسسوارات الشبكات والإنترنت منذ 2020، نغطي كل محافظات مصر.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-gray-900">تواصل</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>📞 01122201212</li>
            <li>💬 01033256630</li>
            <li>✉️ support@salemfornet.art</li>
            <li>✉️ orders@salemfornet.art</li>
            <li>📍 البدرشين، الجيزة، مصر</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-gray-900">السياسات</h3>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:underline" href="/policies/privacy">سياسة الخصوصية</a></li>
            <li><a className="hover:underline" href="/policies/terms">الشروط والأحكام</a></li>
            <li><a className="hover:underline" href="/policies/refund">الاسترجاع والإلغاء</a></li>
            <li><a className="hover:underline" href="/policies/shipping">الشحن والتوصيل</a></li>
            <li><a className="hover:underline" href="/policies/cookies">الكوكيز</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-gray-900">معلومات</h3>
          <p className="text-sm text-gray-700">ساعات العمل: 10 صباحًا – 10 مساءً</p>
          <p className="text-sm text-gray-700 mt-2">الدفع: الدفع عند الاستلام + Paymob/Fawry لاحقًا</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 py-3 border-t">
        © 2025 SalemForNet — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
