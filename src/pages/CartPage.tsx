import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart-store";
import { useProducts } from "@/services/queries";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { formatVnd } from "@/lib/format";
import { Card } from "@/components/ui/card";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQuantity);
  const clear = useCartStore((s) => s.clear);
  const { data } = useProducts({ pageSize: 100 });
  const navigate = useNavigate();

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
  const shipping = subtotal > 5_000_000 || subtotal === 0 ? 0 : 30_000;
  const total = subtotal + shipping;

  if (enriched.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto opacity-30 mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Giỏ hàng đang trống</h2>
        <p className="text-muted-foreground mb-6">Khám phá sản phẩm và thêm vào giỏ ngay nhé!</p>
        <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          <Link to="/products">Mua sắm ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {enriched.map(({ product, quantity }) => (
            <Card key={product.id} className="p-4 flex gap-4">
              <Link to={`/products/${product.slug}`} className="shrink-0">
                <img src={product.thumbnail} alt={product.name} className="h-24 w-24 rounded-lg object-cover bg-muted" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product.slug}`} className="font-medium hover:text-secondary line-clamp-2">{product.name}</Link>
                <p className="text-secondary font-bold mt-1">{formatVnd(product.price)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setQty(product.id, quantity - 1)}><Minus className="h-3 w-3" /></Button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setQty(product.id, quantity + 1)}><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(product.id)}><Trash2 className="h-4 w-4" /></Button>
                <p className="font-bold text-secondary">{formatVnd(product.price * quantity)}</p>
              </div>
            </Card>
          ))}
          <Button variant="ghost" className="text-muted-foreground" onClick={clear}>Xóa toàn bộ giỏ hàng</Button>
        </div>

        <Card className="p-5 h-fit lg:sticky lg:top-32 space-y-3">
          <h3 className="font-display font-bold text-lg">Tóm tắt đơn hàng</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatVnd(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phí vận chuyển</span><span>{shipping === 0 ? "Miễn phí" : formatVnd(shipping)}</span></div>
            <div className="border-t pt-2 flex justify-between font-bold text-base">
              <span>Tổng cộng</span>
              <span className="text-secondary">{formatVnd(total)}</span>
            </div>
          </div>
          <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sale" onClick={() => navigate("/checkout")}>
            Tiến hành thanh toán <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">Cam kết giao hàng đúng hẹn hoặc hoàn tiền</p>
        </Card>
      </div>
    </div>
  );
}
