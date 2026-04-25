import { useState, useMemo } from "react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useProducts, useCreateOrder } from "@/services/queries";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { formatVnd } from "@/lib/format";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { PaymentMethod } from "@/types/domain";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const { data } = useProducts({ pageSize: 100 });
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const [form, setForm] = useState({
    customerName: user?.fullName || "",
    customerPhone: user?.phone || "",
    shippingAddress: "",
    note: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("cod");

  const enriched = useMemo(() => {
    if (!data) return [];
    return items
      .map((i) => { const p = data.items.find((x) => x.id === i.productId); return p ? { ...i, product: p } : null; })
      .filter(Boolean) as Array<{ productId: string; quantity: number; product: NonNullable<typeof data>["items"][number] }>;
  }, [items, data]);

  const subtotal = enriched.reduce((s, x) => s + x.product.price * x.quantity, 0);
  const shipping = subtotal > 5_000_000 ? 0 : 30_000;
  const total = subtotal + shipping;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enriched.length === 0) return toast.error("Giỏ hàng trống");
    if (!form.customerName || !form.customerPhone || !form.shippingAddress) {
      return toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
    }
    const order = await createOrder.mutateAsync({
      userId: user?.id || "guest",
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      shippingAddress: form.shippingAddress,
      paymentMethod: payment,
      items: enriched.map((e) => ({
        productId: e.product.id, productName: e.product.name,
        thumbnail: e.product.thumbnail, price: e.product.price, quantity: e.quantity,
      })),
    });
    clear();
    navigate(`/order-success?code=${order.code}`);
  };

  return (
    <div className="container py-6 md:py-10">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Thanh toán</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="font-display font-bold">Thông tin giao hàng</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Họ và tên *</Label>
                <Input id="name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input id="phone" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="addr">Địa chỉ *</Label>
              <Input id="addr" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea id="note" rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="font-display font-bold">Phương thức thanh toán</h3>
            <RadioGroup value={payment} onValueChange={(v) => setPayment(v as PaymentMethod)} className="gap-2">
              {[
                { v: "cod", label: "Thanh toán khi nhận hàng (COD)" },
                { v: "momo", label: "Ví MoMo" },
                { v: "vnpay", label: "VNPay QR" },
                { v: "card", label: "Thẻ tín dụng / ghi nợ" },
              ].map((o) => (
                <Label key={o.v} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/60 transition-base">
                  <RadioGroupItem value={o.v} />
                  <span className="text-sm font-medium">{o.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </Card>
        </div>

        <Card className="p-5 h-fit lg:sticky lg:top-32 space-y-3">
          <h3 className="font-display font-bold">Đơn hàng ({enriched.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
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
            <div className="flex justify-between"><span className="text-muted-foreground">Vận chuyển</span><span>{shipping === 0 ? "Miễn phí" : formatVnd(shipping)}</span></div>
            <div className="flex justify-between font-bold text-base pt-1 border-t"><span>Tổng</span><span className="text-secondary">{formatVnd(total)}</span></div>
          </div>
          <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sale" disabled={createOrder.isPending}>
            {createOrder.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Đặt hàng
          </Button>
        </Card>
      </form>
    </div>
  );
}
