import { useCompareStore } from "@/store/compare-store";
import { useProducts } from "@/services/queries";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCompare, X, Star, Check } from "lucide-react";
import { formatVnd } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { useMemo } from "react";

export default function ComparePage() {
  const ids = useCompareStore((s) => s.ids);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const add = useCartStore((s) => s.add);
  const { data } = useProducts({ pageSize: 100 });

  const items = useMemo(() => {
    if (!data) return [];
    return ids
      .map((id) => data.items.find((p) => p.id === id))
      .filter(Boolean) as NonNullable<typeof data>["items"];
  }, [ids, data]);

  // Union of all spec keys for table rows
  const specKeys = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => Object.keys(p.specs).forEach((k) => set.add(k)));
    return Array.from(set);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <GitCompare className="h-16 w-16 mx-auto opacity-30 mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Chưa có sản phẩm để so sánh</h2>
        <p className="text-muted-foreground mb-6">Thêm sản phẩm vào danh sách so sánh từ trang sản phẩm.</p>
        <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          <Link to="/products">Mua sắm ngay</Link>
        </Button>
      </div>
    );
  }

  // Find min price for highlight
  const minPrice = Math.min(...items.map((p) => p.price));
  const maxRating = Math.max(...items.map((p) => p.rating));

  return (
    <div className="container py-6 md:py-10">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
            <GitCompare className="h-6 w-6 text-info" /> So sánh sản phẩm
          </h1>
          <p className="text-sm text-muted-foreground">{items.length} sản phẩm</p>
        </div>
        <Button variant="outline" onClick={clear}>Xóa tất cả</Button>
      </div>

      <div className="overflow-x-auto bg-card border rounded-xl">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 w-40 bg-surface sticky left-0">Tiêu chí</th>
              {items.map((p) => (
                <th key={p.id} className="p-3 text-left min-w-[200px]">
                  <div className="relative">
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground hover:opacity-90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <Link to={`/products/${p.slug}`}>
                      <img src={p.thumbnail} alt="" className="h-32 w-32 object-cover rounded-lg mx-auto" />
                      <p className="text-sm font-medium mt-2 line-clamp-2 hover:text-secondary">{p.name}</p>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-semibold bg-surface sticky left-0">Giá</td>
              {items.map((p) => (
                <td key={p.id} className="p-3">
                  <span className={`font-bold text-lg ${p.price === minPrice ? "text-success" : "text-secondary"}`}>
                    {formatVnd(p.price)}
                  </span>
                  {p.price === minPrice && items.length > 1 && (
                    <Badge variant="outline" className="ml-2 border-success/40 text-success text-xs">Rẻ nhất</Badge>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold bg-surface sticky left-0">Thương hiệu</td>
              {items.map((p) => <td key={p.id} className="p-3"><Badge variant="outline">{p.brand}</Badge></td>)}
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold bg-surface sticky left-0">Đánh giá</td>
              {items.map((p) => (
                <td key={p.id} className="p-3">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    {p.rating.toFixed(1)}
                    <span className="text-muted-foreground text-xs">({p.reviewCount})</span>
                    {p.rating === maxRating && items.length > 1 && (
                      <Badge variant="outline" className="ml-1 border-warning/40 text-warning text-xs">Cao nhất</Badge>
                    )}
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold bg-surface sticky left-0">Đã bán</td>
              {items.map((p) => <td key={p.id} className="p-3">{p.soldCount.toLocaleString("vi-VN")}</td>)}
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold bg-surface sticky left-0">Tồn kho</td>
              {items.map((p) => (
                <td key={p.id} className="p-3">
                  {p.stock > 0
                    ? <span className="text-success flex items-center gap-1"><Check className="h-3 w-3" /> Còn {p.stock}</span>
                    : <span className="text-destructive">Hết hàng</span>}
                </td>
              ))}
            </tr>
            {specKeys.map((k) => (
              <tr key={k} className="border-b last:border-0">
                <td className="p-3 font-semibold bg-surface sticky left-0">{k}</td>
                {items.map((p) => (
                  <td key={p.id} className="p-3 text-muted-foreground">{p.specs[k] || "—"}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-3 bg-surface sticky left-0"></td>
              {items.map((p) => (
                <td key={p.id} className="p-3">
                  <Button
                    size="sm"
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    onClick={() => { add(p.id); toast.success("Đã thêm vào giỏ"); }}
                  >
                    Thêm vào giỏ
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
