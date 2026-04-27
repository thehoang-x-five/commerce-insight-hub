import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User as UserIcon, MapPin, Phone, ChevronDown, BarChart3, Menu, Heart, GitCompare, FileText } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCompareStore } from "@/store/compare-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/services/queries";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const QUICK_LINKS = [
  { label: "Khuyến mãi", to: "/products?sort=newest" },
  { label: "Flash Sale", to: "/products?tag=flash" },
  { label: "Trả góp 0%", to: "#" },
  { label: "Tin tức", to: "#" },
  { label: "📑 Báo cáo HTTT", to: "/report" },
];

export function SiteHeader() {
  const totalQty = useCartStore((s) => s.totalQuantity());
  const wishCount = useWishlistStore((s) => s.ids.length);
  const compareCount = useCompareStore((s) => s.ids.length);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const openCart = useUiStore((s) => s.openCart);
  const [search, setSearch] = useState("");
  const { data: categories } = useCategories();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-gradient-brand shadow-card">
      {/* Top tiny bar */}
      <div className="hidden md:block bg-foreground/10 backdrop-blur-sm">
        <div className="container flex h-8 items-center justify-between text-xs text-primary-foreground/80">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Giao đến: TP.HCM</span>
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> Hotline: 1900.6868</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/account/orders" className="hover:underline">Tra cứu đơn hàng</Link>
            <NavLink to="/report" className="flex items-center gap-1 hover:underline">
              <FileText className="h-3 w-3" /> Báo cáo HTTT
            </NavLink>
            <NavLink to="/bi" className="flex items-center gap-1 hover:underline font-medium">
              <BarChart3 className="h-3 w-3" /> BI Dashboard
            </NavLink>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container flex h-16 items-center gap-3 md:gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-secondary-foreground font-display font-extrabold shadow-sale">
            T
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display font-extrabold text-foreground">Thế Giới Di Động</span>
            <span className="text-[10px] uppercase tracking-widest text-foreground/70">B2C E-Commerce</span>
          </div>
        </Link>

        {/* Search */}
        <form
          className="flex-1 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/products?search=${encodeURIComponent(search)}`);
          }}
        >
          <div className="flex items-center bg-background rounded-xl shadow-card overflow-hidden focus-within:ring-2 focus-within:ring-secondary">
            <Search className="h-4 w-4 mx-3 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Bạn tìm gì hôm nay? iPhone 15, MacBook M3, AirPods..."
              className="border-0 focus-visible:ring-0 shadow-none h-11"
            />
            <Button type="submit" variant="secondary" className="h-11 rounded-none px-5 font-semibold">
              Tìm
            </Button>
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <Link to="/wishlist" className="relative hidden sm:inline-flex items-center gap-1 rounded-lg p-2 text-foreground hover:bg-foreground/10 transition-base" aria-label="Yêu thích">
            <Heart className="h-5 w-5" />
            {wishCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center bg-secondary text-secondary-foreground border-0 px-1 text-[10px]">
                {wishCount}
              </Badge>
            )}
          </Link>
          <Link to="/compare" className="relative hidden sm:inline-flex items-center gap-1 rounded-lg p-2 text-foreground hover:bg-foreground/10 transition-base" aria-label="So sánh">
            <GitCompare className="h-5 w-5" />
            {compareCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center bg-info text-info-foreground border-0 px-1 text-[10px]">
                {compareCount}
              </Badge>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:bg-foreground/10 gap-2 px-2">
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden lg:inline max-w-[120px] truncate">{user.fullName}</span>
                  <ChevronDown className="h-4 w-4 hidden lg:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/account">Tài khoản của tôi</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/account/orders">Đơn hàng</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/wishlist">Sản phẩm yêu thích</Link></DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild><Link to="/admin">Trang quản trị</Link></DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" className="text-foreground hover:bg-foreground/10 gap-2">
              <Link to="/login"><UserIcon className="h-5 w-5" /><span className="hidden lg:inline">Đăng nhập</span></Link>
            </Button>
          )}

          <button
            onClick={openCart}
            className="relative inline-flex items-center gap-2 rounded-lg bg-foreground/10 px-3 py-2 text-foreground hover:bg-foreground/20 transition-base"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden lg:inline text-sm font-medium">Giỏ hàng</span>
            {totalQty > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 min-w-5 justify-center bg-secondary text-secondary-foreground border-0 px-1.5">
                {totalQty}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden md:block border-t border-foreground/10 bg-background/30 backdrop-blur-sm">
        <div className="container flex h-11 items-center gap-1 overflow-x-auto scrollbar-hide">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-foreground/10 gap-2 font-semibold">
                <Menu className="h-4 w-4" /> Danh mục
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {categories?.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link to={`/products?category=${c.id}`}>{c.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="px-3 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-md whitespace-nowrap transition-base"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
