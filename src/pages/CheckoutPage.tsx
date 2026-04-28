import { useState, useMemo } from "react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useProducts, useCreateOrder } from "@/services/queries";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { formatVnd } from "@/lib/format";
import { toast } from "sonner";
import {
  Loader2, Tag, X, Check, ShoppingBag, MapPin, Truck, CreditCard,
  ClipboardCheck, ChevronLeft, ChevronRight, Wallet, Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PaymentMethod } from "@/types/domain";
import { applyCoupon, COUPONS, type Coupon } from "@/lib/coupons";
import { installmentPlans, calcMonthly } from "@/api/news-data";

type ShippingMethod = "standard" | "express" | "store-pickup";

const STEPS = [
  { id: 1, label: "Giỏ hàng", Icon: ShoppingBag },
  { id: 2, label: "Địa chỉ", Icon: MapPin },
  { id: 3, label: "Vận chuyển", Icon: Truck },
  { id: 4, label: "Thanh toán", Icon: CreditCard },
  { id: 5, label: "Xác nhận", Icon: ClipboardCheck },
] as const;

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const { data } = useProducts({ pageSize: 100 });
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customerName: user?.fullName || "",
    customerPhone: user?.phone || "",
    province: "TP. Hồ Chí Minh",
    district: "",
    ward: "",
    street: "",
    note: "",
  });
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [installmentIdx, setInstallmentIdx] = useState<number | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);

  const enriched = useMemo(() => {
    if (!data) return [];
    return items
      .map((i) => {
        const p = data.items.find((x) => x.id === i.productId);
        return p ? { ...i, product: p } : null;
      })
      .filter(Boolean) as Array<{ productId: string; quantity: number; product: NonNullable<typeof data>["items"][number] }>;
  }, [items, data]);

  const subtotal = enriched.reduce((s, x) => s + x.product.price * x.quantity, 0);

  const shippingFee = useMemo(() => {
    if (coupon?.code === "FREESHIP") return 0;
    if (shipping === "store-pickup") return 0;
    if (shipping === "express") return 50_000;
    return subtotal > 5_000_000 ? 0 : 30_000;
  }, [coupon, shipping, subtotal]);

  const total = Math.max(0, subtotal + shippingFee - discount);
  const installmentResult = installmentIdx != null ? calcMonthly(total, installmentPlans[installmentIdx]) : null;

  const fullAddress = [form.street, form.ward, form.district, form.province].filter(Boolean).join(", ");

  // ── Validation per step ──
  const canNext = (): boolean => {
    if (step === 1) return enriched.length > 0;
    if (step === 2) {
      if (!form.customerName || !form.customerPhone || !form.street || !form.district) {
        toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
        return false;
      }
      if (!/^0\d{9,10}$/.test(form.customerPhone)) {
        toast.error("Số điện thoại không hợp lệ");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleApplyCoupon = () => {
    const r = applyCoupon(couponInput, subtotal);
    if (r.error) return toast.error(r.error);
    setCoupon(r.coupon);
    setDiscount(r.discount);
    toast.success(`Áp mã ${r.coupon!.code} thành công — giảm ${formatVnd(r.discount)}`);
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscount(0);
    setCouponInput("");
  };

  const submit = async () => {
    if (enriched.length === 0) return toast.error("Giỏ hàng trống");
    const order = await createOrder.mutateAsync({
      userId: user?.id || "guest",
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      shippingAddress: fullAddress,
      paymentMethod: payment,
      discount,
      couponCode: coupon?.code,
      items: enriched.map((e) => ({
        productId: e.product.id,
        productName: e.product.name,
        thumbnail: e.product.thumbnail,
        price: e.product.price,
        quantity: e.quantity,
      })),
    });
    clear();
    navigate(`/order-success?code=${order.code}`);
  };

  return (
    <div className="container py-6 md:py-10">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Thanh toán</h1>

      {/* Stepper */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-fit">
          {STEPS.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => done && setStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-base ${
                    active ? "bg-secondary text-secondary-foreground shadow-sale" :
                    done ? "bg-success/10 text-success hover:bg-success/20" :
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                    active ? "bg-foreground text-background" :
                    done ? "bg-success text-success-foreground" :
                    "bg-card text-foreground/60 border"
                  }`}>
                    {done ? <Check className="h-3 w-3" /> : s.id}
                  </span>
                  <s.Icon className="h-4 w-4 hidden sm:inline" />
                  <span className="text-sm font-medium whitespace-nowrap">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          {/* STEP 1 — CART REVIEW */}
          {step === 1 && (
            <Card className="p-5 space-y-4">
              <h3 className="font-display font-bold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-secondary" /> Xem lại giỏ hàng ({enriched.length})
              </h3>
              {enriched.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto opacity-30 mb-2" />
                  <p>Giỏ hàng đang trống</p>
                  <Button asChild variant="outline" className="mt-3"><Link to="/products">Tiếp tục mua sắm</Link></Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {enriched.map((e) => (
                    <div key={e.product.id} className="flex gap-3 p-3 border rounded-lg">
                      <img src={e.product.thumbnail} className="h-16 w-16 rounded object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{e.product.name}</p>
                        <p className="text-sm text-secondary font-bold">{formatVnd(e.product.price)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQuantity(e.product.id, e.quantity - 1)}>−</Button>
                          <span className="text-sm w-8 text-center">{e.quantity}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQuantity(e.product.id, e.quantity + 1)}>+</Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 ml-auto" onClick={() => removeItem(e.product.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* STEP 2 — ADDRESS */}
          {step === 2 && (
            <Card className="p-5 space-y-4">
              <h3 className="font-display font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" /> Thông tin giao hàng
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input id="name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input id="phone" placeholder="0901234567" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <Label>Tỉnh/Thành *</Label>
                  <Input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} />
                </div>
                <div>
                  <Label>Quận/Huyện *</Label>
                  <Input placeholder="Quận 1" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
                </div>
                <div>
                  <Label>Phường/Xã</Label>
                  <Input placeholder="Phường Bến Nghé" value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Số nhà, đường *</Label>
                <Input placeholder="123 Lê Lợi" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="note">Ghi chú đơn hàng</Label>
                <Textarea id="note" rows={2} placeholder="Giao trong giờ hành chính..." value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </div>
            </Card>
          )}

          {/* STEP 3 — SHIPPING */}
          {step === 3 && (
            <Card className="p-5 space-y-3">
              <h3 className="font-display font-bold flex items-center gap-2">
                <Truck className="h-4 w-4 text-secondary" /> Phương thức vận chuyển
              </h3>
              <RadioGroup value={shipping} onValueChange={(v) => setShipping(v as ShippingMethod)} className="gap-2">
                {[
                  { v: "standard", label: "Giao hàng tiêu chuẩn", desc: "1-3 ngày làm việc", fee: subtotal > 5_000_000 ? "Miễn phí" : "30.000đ" },
                  { v: "express", label: "Giao hàng nhanh 2 giờ", desc: "Nội thành TP.HCM/HN", fee: "50.000đ" },
                  { v: "store-pickup", label: "Nhận tại cửa hàng", desc: "Sẵn sàng sau 30 phút", fee: "Miễn phí" },
                ].map((o) => (
                  <Label key={o.v} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-secondary/60 transition-base">
                    <RadioGroupItem value={o.v} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{o.label}</p>
                      <p className="text-xs text-muted-foreground">{o.desc}</p>
                    </div>
                    <Badge variant="outline" className="font-mono">{o.fee}</Badge>
                  </Label>
                ))}
              </RadioGroup>

              <div className="pt-3 border-t">
                <h4 className="font-display font-semibold text-sm mb-2 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-secondary" /> Mã giảm giá
                </h4>
                {coupon ? (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-success/10 border border-success/30">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span><strong>{coupon.code}</strong> — giảm {formatVnd(discount)}</span>
                    </div>
                    <Button type="button" size="sm" variant="ghost" onClick={removeCoupon}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="Nhập mã giảm giá..." value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
                    <Button type="button" variant="outline" onClick={handleApplyCoupon}>Áp dụng</Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COUPONS.map((c) => (
                    <Badge
                      key={c.code}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground hover:border-secondary text-[10px]"
                      onClick={() => setCouponInput(c.code)}
                    >
                      {c.code}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* STEP 4 — PAYMENT */}
          {step === 4 && (
            <>
              <Card className="p-5 space-y-3">
                <h3 className="font-display font-bold flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-secondary" /> Phương thức thanh toán
                </h3>
                <RadioGroup value={payment} onValueChange={(v) => { setPayment(v as PaymentMethod); setInstallmentIdx(null); }} className="gap-2">
                  {[
                    { v: "cod", label: "Thanh toán khi nhận hàng (COD)", desc: "Trả tiền mặt cho shipper" },
                    { v: "momo", label: "Ví MoMo", desc: "Quét mã QR thanh toán" },
                    { v: "vnpay", label: "VNPay QR", desc: "Tất cả ngân hàng nội địa" },
                    { v: "card", label: "Thẻ tín dụng / ghi nợ", desc: "Visa, Master, JCB" },
                  ].map((o) => (
                    <Label key={o.v} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-secondary/60 transition-base">
                      <RadioGroupItem value={o.v} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{o.label}</p>
                        <p className="text-xs text-muted-foreground">{o.desc}</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </Card>

              <Card className="p-5 space-y-3">
                <h3 className="font-display font-bold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-info" /> Trả góp (tuỳ chọn)
                </h3>
                <p className="text-xs text-muted-foreground">Chọn gói trả góp 0% hoặc lãi suất ưu đãi cho đơn hàng này:</p>
                <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setInstallmentIdx(null)}
                    className={`p-3 rounded-lg border-2 text-left transition-base ${
                      installmentIdx == null ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/40"
                    }`}
                  >
                    <p className="text-sm font-semibold">Thanh toán toàn bộ</p>
                    <p className="text-xs text-muted-foreground">Không trả góp</p>
                  </button>
                  {installmentPlans.map((plan, i) => {
                    const r = calcMonthly(total, plan);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInstallmentIdx(i)}
                        className={`p-3 rounded-lg border-2 text-left transition-base ${
                          installmentIdx === i ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold">{plan.months} tháng · {plan.partner}</p>
                          {plan.interestRate === 0 && <Badge className="bg-success text-success-foreground text-[10px] border-0">0%</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">Trả trước {plan.prepayPercent}% ({formatVnd(r.prepay)})</p>
                        <p className="text-sm text-secondary font-bold mt-1">{formatVnd(r.monthly)}/tháng</p>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </>
          )}

          {/* STEP 5 — CONFIRMATION */}
          {step === 5 && (
            <Card className="p-5 space-y-4">
              <h3 className="font-display font-bold flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-secondary" /> Xác nhận đơn hàng
              </h3>

              <div className="space-y-3 text-sm">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-surface">
                    <p className="text-xs text-muted-foreground mb-1">Người nhận</p>
                    <p className="font-semibold">{form.customerName}</p>
                    <p className="text-xs">{form.customerPhone}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface">
                    <p className="text-xs text-muted-foreground mb-1">Địa chỉ giao hàng</p>
                    <p className="text-xs">{fullAddress || "—"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface">
                    <p className="text-xs text-muted-foreground mb-1">Vận chuyển</p>
                    <p className="font-semibold capitalize">{
                      shipping === "standard" ? "Tiêu chuẩn" : shipping === "express" ? "Nhanh 2h" : "Nhận tại cửa hàng"
                    }</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface">
                    <p className="text-xs text-muted-foreground mb-1">Thanh toán</p>
                    <p className="font-semibold uppercase">{payment}</p>
                    {installmentResult && (
                      <p className="text-xs text-info mt-1">
                        Trả góp {installmentPlans[installmentIdx!].months} tháng — {formatVnd(installmentResult.monthly)}/tháng
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="font-semibold mb-2">Sản phẩm ({enriched.length})</p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {enriched.map((e) => (
                      <div key={e.product.id} className="flex justify-between text-xs">
                        <span className="line-clamp-1">{e.product.name} × {e.quantity}</span>
                        <span className="font-medium shrink-0">{formatVnd(e.product.price * e.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground italic">
                  Bằng việc đặt hàng, bạn đồng ý với <Link to="#" className="text-secondary hover:underline">Điều khoản dịch vụ</Link> của TGDĐ.
                </p>
              </div>
            </Card>
          )}

          {/* Step navigation */}
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
            </Button>
            {step < 5 ? (
              <Button
                onClick={() => canNext() && setStep((s) => Math.min(5, s + 1))}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Tiếp tục <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={submit}
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sale"
                disabled={createOrder.isPending}
              >
                {createOrder.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                Đặt hàng
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar summary */}
        <Card className="p-5 h-fit lg:sticky lg:top-32 space-y-3">
          <h3 className="font-display font-bold">Tóm tắt đơn hàng</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {enriched.map((e) => (
              <div key={e.product.id} className="flex gap-2 text-sm">
                <img src={e.product.thumbnail} className="h-12 w-12 rounded object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-1">{e.product.name}</p>
                  <p className="text-xs text-muted-foreground">{e.quantity} × {formatVnd(e.product.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatVnd(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Vận chuyển</span><span>{shippingFee === 0 ? "Miễn phí" : formatVnd(shippingFee)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-success"><span>Giảm giá ({coupon?.code})</span><span>-{formatVnd(discount)}</span></div>
            )}
            <div className="flex justify-between font-bold text-base pt-1 border-t"><span>Tổng</span><span className="text-secondary">{formatVnd(total)}</span></div>
            {installmentResult && (
              <div className="bg-info/10 border border-info/30 rounded-lg p-2 text-xs text-info">
                Trả trước: <strong>{formatVnd(installmentResult.prepay)}</strong> · Trả góp: <strong>{formatVnd(installmentResult.monthly)}/tháng × {installmentPlans[installmentIdx!].months}</strong>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
