import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useUiStore } from "@/store/ui-store";
import { useCartStore } from "@/store/cart-store";
import { useProducts } from "@/services/queries";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatVnd } from "@/lib/format";
import { Link } from "react-router-dom";
import { useMemo } from "react";

export function CartDrawer() {
  const open = useUiStore((s) => s.cartDrawerOpen);
  const close = useUiStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQuantity);
  const { data } = useProducts({ pageSize: 100 });

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

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : close())}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-secondary" />
            Giỏ hàng ({enriched.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-3">
          {enriched.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto opacity-30 mb-3" />
              <p>Giỏ hàng trống</p>
            </div>
          )}

          {enriched.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-3 p-2 rounded-lg border border-border/60">
              <img src={product.thumbnail} alt={product.name} className="h-16 w-16 rounded-md object-cover bg-muted" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                <p className="text-secondary font-bold text-sm mt-1">{formatVnd(product.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(product.id, quantity - 1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(product.id, quantity + 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 ml-auto text-destructive" onClick={() => remove(product.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {enriched.length > 0 && (
          <SheetFooter className="flex-col gap-3 border-t pt-4 sm:flex-col sm:space-x-0">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính</span>
              <span className="font-bold text-secondary text-base">{formatVnd(subtotal)}</span>
            </div>
            <Button asChild size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={close}>
              <Link to="/checkout">Tiến hành thanh toán</Link>
            </Button>
            <Button asChild variant="outline" className="w-full" onClick={close}>
              <Link to="/cart">Xem giỏ hàng</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
