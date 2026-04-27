import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Heart, GitCompare, User } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCompareStore } from "@/store/compare-store";

const items = [
  { to: "/", icon: Home, label: "Trang chủ" },
  { to: "/products", icon: ShoppingBag, label: "Sản phẩm" },
  { to: "/wishlist", icon: Heart, label: "Yêu thích", store: "wish" as const },
  { to: "/compare", icon: GitCompare, label: "So sánh", store: "compare" as const },
  { to: "/account", icon: User, label: "Tài khoản" },
];

export function MobileBottomNav() {
  const loc = useLocation();
  const wish = useWishlistStore((s) => s.ids.length);
  const comp = useCompareStore((s) => s.ids.length);

  // Hide on admin/bi
  if (loc.pathname.startsWith("/admin") || loc.pathname.startsWith("/bi") || loc.pathname.startsWith("/checkout")) return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-card border-t shadow-card-hover">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const active = loc.pathname === it.to;
          const count = it.store === "wish" ? wish : it.store === "compare" ? comp : 0;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium relative transition-base ${
                active ? "text-secondary" : "text-muted-foreground"
              }`}
            >
              <it.icon className={`h-5 w-5 ${active ? "fill-secondary/20" : ""}`} />
              {count > 0 && (
                <span className="absolute top-1 right-1/2 translate-x-3 grid h-4 min-w-4 px-1 place-items-center rounded-full bg-secondary text-secondary-foreground text-[9px] font-bold">
                  {count}
                </span>
              )}
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
