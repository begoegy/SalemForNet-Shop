export function egp(v: number) {
  try {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(v);
  } catch {
    return `${v} ج.م`;
  }
}
