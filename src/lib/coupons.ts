// Mock coupons — easy to swap for real API later
export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  min?: number;
  description: string;
}

export const COUPONS: Coupon[] = [
  { code: "TGDD10", type: "percent", value: 10, min: 1_000_000, description: "Giảm 10% đơn từ 1tr (tối đa 500k)" },
  { code: "FREESHIP", type: "fixed", value: 30_000, description: "Miễn phí vận chuyển 30.000đ" },
  { code: "SALE500K", type: "fixed", value: 500_000, min: 10_000_000, description: "Giảm 500.000đ cho đơn từ 10tr" },
  { code: "NEWUSER", type: "percent", value: 5, description: "Giảm 5% cho khách mới (tối đa 200k)" },
];

export function applyCoupon(code: string, subtotal: number): { coupon: Coupon | null; discount: number; error?: string } {
  const c = COUPONS.find((x) => x.code.toLowerCase() === code.trim().toLowerCase());
  if (!c) return { coupon: null, discount: 0, error: "Mã không hợp lệ" };
  if (c.min && subtotal < c.min) return { coupon: null, discount: 0, error: `Đơn tối thiểu ${(c.min / 1_000_000).toFixed(0)} triệu` };
  let discount = c.type === "fixed" ? c.value : Math.round((subtotal * c.value) / 100);
  if (c.code === "TGDD10") discount = Math.min(discount, 500_000);
  if (c.code === "NEWUSER") discount = Math.min(discount, 200_000);
  return { coupon: c, discount };
}
