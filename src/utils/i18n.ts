export type Lang = "ar" | "en";

export const dictionary = {
  ar: {
    startShopping: "ابدأ التسوّق",
    addToCart: "أضف للسلة",
    outOfStock: "غير متاح",
    search: "بحث",
    categories: "الفئات",
    cart: "السلة",
    checkout: "إتمام الطلب",
    features: ["ضمان معتمد", "شحن سريع", "دعم فني محترف"],
    bestSellers: "الأكثر مبيعًا",
    offers: "عروض مميزة",
    catalog: "الكتالوج",
    account: "حسابي"
  },
  en: {
    startShopping: "Start shopping",
    addToCart: "Add to cart",
    outOfStock: "Unavailable",
    search: "Search",
    categories: "Categories",
    cart: "Cart",
    checkout: "Checkout",
    features: ["Certified warranty", "Fast shipping", "Pro technical support"],
    bestSellers: "Best sellers",
    offers: "Featured deals",
    catalog: "Catalog",
    account: "My Account"
  }
} as const;
