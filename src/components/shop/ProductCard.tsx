import { Link } from "react-router-dom";
import type { Product } from "@/types/domain";
import { Card } from "@/components/ui/card";
import { Star, ShoppingCart, Heart, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCompareStore } from "@/store/compare-store";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const add = useCartStore((s) => s.add);
  const wished = useWishlistStore((s) => s.ids.includes(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const compared = useCompareStore((s) => s.ids.includes(product.id));
  const toggleCompare = useCompareStore((s) => s.toggle);

  return (
    <Card className="group relative overflow-hidden border-border/60 hover:border-primary/60 transition-base hover:shadow-card-hover h-full flex flex-col">
      {product.discountPercent ? (
        <div className="absolute top-2 left-2 z-10 bg-gradient-sale text-secondary-foreground text-xs font-bold px-2 py-0.5 rounded-md shadow-sale">
          -{product.discountPercent}%
        </div>
      ) : null}
      {product.isFlashSale && (
        <Badge className="absolute top-2 right-2 z-10 bg-secondary text-secondary-foreground border-0">Flash</Badge>
      )}

      {/* Floating actions */}
      <div className="absolute top-10 right-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-base">
        <button
          aria-label="Yêu thích"
          onClick={(e) => {
            e.preventDefault();
            toggleWish(product.id);
            toast.success(wished ? "Đã bỏ khỏi yêu thích" : "Đã thêm vào yêu thích");
          }}
          className={`grid h-8 w-8 place-items-center rounded-full bg-card shadow-card hover:bg-secondary hover:text-secondary-foreground transition-base ${wished ? "text-secondary" : ""}`}
        >
          <Heart className={`h-3.5 w-3.5 ${wished ? "fill-secondary" : ""}`} />
        </button>
        <button
          aria-label="So sánh"
          onClick={(e) => {
            e.preventDefault();
            toggleCompare(product.id);
            if (!compared) toast.success("Đã thêm vào danh sách so sánh");
          }}
          className={`grid h-8 w-8 place-items-center rounded-full bg-card shadow-card hover:bg-info hover:text-info-foreground transition-base ${compared ? "text-info" : ""}`}
        >
          <GitCompare className="h-3.5 w-3.5" />
        </button>
      </div>

      <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-surface">
        <img
          src={product.thumbnail}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-bounce group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col flex-1 p-3 gap-2">
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className={`font-medium line-clamp-2 leading-snug ${compact ? "text-sm" : "text-sm md:text-base"} hover:text-secondary`}>
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-secondary font-bold text-base md:text-lg">{formatVnd(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatVnd(product.originalPrice)}</span>
            )}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {product.rating.toFixed(1)} <span className="opacity-60">({product.reviewCount})</span>
            </span>
            <span>Đã bán {product.soldCount.toLocaleString("vi-VN")}</span>
          </div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          className="w-full opacity-0 group-hover:opacity-100 transition-base mt-1"
          onClick={(e) => {
            e.preventDefault();
            add(product.id, 1);
            toast.success(`Đã thêm "${product.name}" vào giỏ`);
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-1" /> Thêm vào giỏ
        </Button>
      </div>
    </Card>
  );
}
