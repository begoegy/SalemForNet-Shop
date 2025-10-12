# SalemForNet Shop (Next.js + Tailwind)

متجر إلكتروني ثنائي اللغة (عربي/إنجليزي) لبيع إكسسوارات الشبكات — **SalemForNet**.

## التشغيل محليًا

```bash
npm i
npm run dev
```

> يعمل بدون Firebase أو بوابات الدفع (وضع **mock**) بشكل افتراضي. لتفعيل Firebase/Paymob/Fawry عدِّل `.env.local` بمفاتيحك.

## البيئة

انسخ `.env.example` إلى `.env.local` وعدِّل القيم.

## البناء والإطلاق

```bash
npm run build
npm start
```

## المزايا
- RTL/LTR وزر تبديل فوري.
- كتالوج من `/src/data/products.json`.
- سلة محلية مع الحفظ في LocalStorage + Checkout تجريبي.
- صفحات سياسات/حساب/تواصل/عنّا جاهزة.
- بدون `next/image` لتفادي مشاكل `sharp`.
