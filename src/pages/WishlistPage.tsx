import { useWishlistStore } from "@/store/wishlist-store";
import { useProducts } from "@/services/queries";
import { ProductCard } from "@/components/shop/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const clear = useWishlistStore((s) => s.clear);
  const { data } = useProducts({ pageSize: 100 });

  const items = ids
    .map((id) => data?.items.find((p) => p.id === id))
    .filter(Boolean) as NonNullable<typeof data>["items"];

  return (
    <div className="container py-6 md:py-10">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-secondary fill-secondary" /> Sản phẩm yêu thích
          </h1>
          <p className="text-sm text-muted-foreground">{items.length} sản phẩm</p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" onClick={clear}>Xóa tất cả</Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-16 w-16 mx-auto opacity-30 mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Chưa có sản phẩm yêu thích</h2>
          <p className="text-muted-foreground mb-6">Hãy thả tim các sản phẩm bạn quan tâm để xem lại sau.</p>
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Link to="/products">Khám phá sản phẩm</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
