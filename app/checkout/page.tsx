const payWithPaymob = async () => {
  try {
    if (loading) return;
    if (!user) {
      alert("سجّل الدخول أولاً لإتمام الدفع.");
      return;
    }
    if (!phone || !name) {
      alert("ادخل الاسم ورقم الهاتف أولاً.");
      return;
    }

    const provider =
      typeof process !== "undefined" && (process as any)?.env?.NEXT_PUBLIC_PAYMENT_PROVIDER
        ? (process as any).env.NEXT_PUBLIC_PAYMENT_PROVIDER
        : "mock";

    // نحاول إنشاء طلب pending في Firestore، ولو فشل نكمّل عادي بالـ mock
    let merchantOrderId = "";
    if (firebaseEnabled) {
      try {
        const payload = {
          userId: user.uid,
          items: rows.map((r) => ({
            product_id: r.p.id,
            sku: r.p.sku,
            qty: r.qty,
            unit_price: r.p.price_egp ?? 0,
          })),
          total,
          status: "pending",
          payment: { method: provider === "mock" ? "mock" : "paymob", status: "pending" },
          customer: {
            name: name || user.displayName || "",
            email: user.email || "",
            phone,
            address,
          },
          created_at: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "orders"), payload);
        merchantOrderId = docRef.id;
      } catch (e) {
        console.warn("Firestore pending order failed, fallback to local id:", e);
        merchantOrderId = "SFN-" + Date.now();
      }
    } else {
      merchantOrderId = "SFN-" + Date.now();
    }

    if (provider === "mock") {
      const res = await fetch("/api/mock/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address, amount: total, merchantOrderId }),
      });
      let data: any = null;
      try { data = await res.json(); } catch {}
      if (!res.ok || !data?.ok) {
        console.error("Mock checkout failed:", { status: res.status, data });
        alert(`فشل الدفع التجريبي: ${data?.reason || res.statusText || "غير معروف"}`);
        return;
      }
      const returnUrl = data?.returnUrl || `/pay/return?success=true&order=${encodeURIComponent(merchantOrderId)}`;
      window.location.href = returnUrl;
      return;
    }

    // Paymob الحقيقي (لما المفاتيح تتوفر)
    const [firstName, ...rest] = (name || "").trim().split(" ");
    const lastName = rest.join(" ");
    const res = await fetch("/api/paymob/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        email: user.email || "",
        phone,
        firstName: firstName || "Customer",
        lastName,
        merchantOrderId,
      }),
    });
    let data: any = null;
    try { data = await res.json(); } catch {}
    if (!res.ok) {
      console.error("Paymob intent failed:", { status: res.status, data });
      alert(`فشل إنشاء عملية الدفع: ${data?.error || res.statusText || "غير معروف"}`);
      return;
    }
    window.location.href = data.iframeUrl;
  } catch (err: any) {
    console.error("payWithPaymob fatal:", err);
    alert(`حصل خطأ أثناء تهيئة الدفع: ${err?.message || "غير معروف"}`);
  }
};
