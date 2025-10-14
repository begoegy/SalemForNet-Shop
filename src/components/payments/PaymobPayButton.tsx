"use client";
import React from "react";
import PaymobButton from "./payments/PaymobButton"; // <- استيراد نسبي يشتغل على لينكس

import { useAuth } from "@/context/AuthContext";

type Props = {
  label?: string;
  amount?: number;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  merchantOrderId?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export default function PaymobPayButton(props: Props) {
  const { user } = useAuth();

  // لو فيه اسم من الـ props نستخدمه، وإلا نحاول نستنتجه من displayName
  const displayName = props.firstName || user?.displayName || "";
  const [first, ...rest] = displayName.split(" ").filter(Boolean);
  const inferredFirst = props.firstName ?? (first || "");
  const inferredLast = props.lastName ?? (rest.join(" ") || "");

  const email = props.email ?? (user?.email || "");
  const phone = props.phone ?? (user?.phoneNumber || "");

  return (
    <PaymobButton
      totalAmount={props.amount}
      amount={props.amount}
      email={email}
      phone={phone}
      firstName={inferredFirst || "Customer"}
      lastName={inferredLast}
      merchantOrderId={props.merchantOrderId}
      className={props.className}
      style={props.style}
    >
      {props.children ?? props.label ?? "الدفع بالبطاقة (Paymob)"}
    </PaymobButton>
  );
}
