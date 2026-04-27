import { useParams, Link } from "react-router-dom";
import { useProduct, useProductReviews } from "@/services/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Star, ShoppingCart, Truck, ShieldCheck, RotateCcw, Minus, Plus, Heart, GitCompare, Share2 } from "lucide-react";
import { formatVnd, formatDate } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCompareStore } from "@/store/compare-store";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: reviews } = useProductReviews(product?.id || "");
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  const openCart = useUiStore((s) => s.openCart);
  const wished = useWishlistStore((s) => product ? s.ids.includes(product.id) : false);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const compared = useCompareStore((s) => product ? s.ids.includes(product.id) : false);
  const toggleCompare = useCompareStore((s) => s.toggle);

  if (isLoading) {
    return (
      <div className="container py-8 grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" /><Skeleton className="h-6 w-1/2" /><Skeleton className="h-32" />
        </div>
      </div>
    );
  }
  if (!product) return <div className="container py-20 text-center">Không tìm thấy sản phẩm.</div>;

  const handleAdd = () => {
    add(product.id, qty);
    toast.success(`Đã thêm ${qty} × "${product.name}" vào giỏ`);
  };

  return (
    <div className="container py-6 md:py-10">
      <div className="text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground">Trang chủ</Link> /{" "}
        <Link to="/products" className="hover:text-foreground">Sản phẩm</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-surface border">
            <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-base ${
                  activeImage === i ? "border-secondary" : "border-transparent hover:border-border"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{product.brand}</Badge>
            {product.tags.map((t) => <Badge key={t} className="bg-secondary text-secondary-foreground border-0">{t}</Badge>)}
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold">{product.name}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.reviewCount} đánh giá)</span>
            </span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">Đã bán {product.soldCount.toLocaleString("vi-VN")}</span>
          </div>

          <div className="bg-gradient-sale rounded-xl p-4 text-secondary-foreground">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-display font-extrabold">{formatVnd(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="line-through opacity-70">{formatVnd(product.originalPrice)}</span>
                  <Badge className="bg-primary text-primary-foreground border-0">-{product.discountPercent}%</Badge>
                </>
              )}
            </div>
            <p className="text-xs mt-1 opacity-90">Giá đã bao gồm VAT · Trả góp từ {formatVnd(product.price / 12)}/tháng</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.shortDescription}</p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {[{ Icon: Truck, t: "Giao nhanh 2h" }, { Icon: ShieldCheck, t: "BH chính hãng" }, { Icon: RotateCcw, t: "Đổi trả 30 ngày" }].map(({ Icon, t }) => (
              <div key={t} className="flex items-center gap-2 p-2 rounded-lg bg-surface">
                <Icon className="h-4 w-4 text-success" /> {t}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm font-medium">Số lượng:</span>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">Còn {product.stock} sp</span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button size="lg" variant="outline" onClick={handleAdd} className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" /> Thêm vào giỏ
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sale"
              onClick={() => { handleAdd(); openCart(); }}
            >
              Mua ngay
            </Button>
            <Button size="icon" variant="outline" className={`h-11 w-11 ${wished ? "border-secondary text-secondary" : ""}`}
              onClick={() => { toggleWish(product.id); toast.success(wished ? "Bỏ yêu thích" : "Đã thêm yêu thích"); }}>
              <Heart className={`h-4 w-4 ${wished ? "fill-secondary" : ""}`} />
            </Button>
            <Button size="icon" variant="outline" className={`h-11 w-11 ${compared ? "border-info text-info" : ""}`}
              onClick={() => { toggleCompare(product.id); }}>
              <GitCompare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="desc" className="mt-10">
        <TabsList>
          <TabsTrigger value="desc">Mô tả</TabsTrigger>
          <TabsTrigger value="specs">Thông số</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({reviews?.length || 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="desc" className="bg-card border rounded-xl p-6 leading-relaxed text-sm">
          {product.description}
        </TabsContent>
        <TabsContent value="specs" className="bg-card border rounded-xl p-6">
          <dl className="grid sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
        <TabsContent value="reviews" className="bg-card border rounded-xl p-6 space-y-4">
          {reviews?.map((r) => (
            <div key={r.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{r.userName}</span>
                <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{r.comment}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
