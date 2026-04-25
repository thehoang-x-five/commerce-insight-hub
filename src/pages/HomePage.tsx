import { Link } from "react-router-dom";
import { useProducts, useCategories } from "@/services/queries";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone, Laptop, Tablet, Headphones, Watch, Tv, Camera, Refrigerator,
  Truck, ShieldCheck, CreditCard, RotateCcw, Zap, ArrowRight, Flame,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ICON_MAP: Record<string, typeof Smartphone> = {
  Smartphone, Laptop, Tablet, Headphones, Watch, Tv, Camera, Refrigerator,
};

const TRUST_BADGES = [
  { icon: Truck, title: "Giao nhanh 2h", desc: "Nội thành TP.HCM & Hà Nội" },
  { icon: ShieldCheck, title: "Chính hãng 100%", desc: "Bảo hành chính hãng toàn quốc" },
  { icon: CreditCard, title: "Trả góp 0%", desc: "Qua thẻ tín dụng & Home Credit" },
  { icon: RotateCcw, title: "Đổi trả trong 30 ngày", desc: "Lỗi do nhà sản xuất" },
];

export default function HomePage() {
  const { data: cats } = useCategories();
  const { data: featured, isLoading } = useProducts({ sort: "popular", pageSize: 10 });
  const { data: flash } = useProducts({ sort: "popular", pageSize: 6 });

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white,transparent_50%)]" />
        <div className="container relative grid md:grid-cols-2 gap-8 py-12 md:py-20 items-center">
          <div className="text-secondary-foreground space-y-5 animate-fade-in">
            <Badge className="bg-primary text-primary-foreground border-0 text-xs font-bold uppercase tracking-wider">
              <Flame className="h-3 w-3 mr-1" /> Siêu sale tháng 4
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight text-balance">
              iPhone 15 Pro Max <br />
              <span className="text-primary">Giảm tới 5 triệu</span>
            </h1>
            <p className="text-lg text-secondary-foreground/90 max-w-md">
              Chính hãng VN/A · Trả góp 0% · Thu cũ đổi mới giá tốt nhất hệ thống.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold shadow-brand">
                <Link to="/products?category=c1">Mua ngay <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-secondary-foreground/40 text-secondary-foreground hover:bg-secondary-foreground/10">
                <Link to="/products">Xem tất cả</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute -inset-10 bg-primary/30 rounded-full blur-3xl" />
            <img
              src="https://picsum.photos/seed/iphone15-hero/700/700"
              alt="iPhone 15 Pro Max"
              className="relative rounded-2xl shadow-2xl animate-float w-full"
            />
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="container -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-card rounded-2xl shadow-card p-4">
          {TRUST_BADGES.map((b) => (
            <div key={b.title} className="flex items-center gap-3 p-2">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-10">
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Danh mục nổi bật</h2>
          <Link to="/products" className="text-sm text-secondary font-medium hover:underline">Xem tất cả</Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {cats?.map((c) => {
            const Icon = ICON_MAP[c.icon ?? "Smartphone"] || Smartphone;
            return (
              <Link
                key={c.id}
                to={`/products?category=${c.id}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-surface hover:bg-primary/10 hover:-translate-y-0.5 transition-base border border-transparent hover:border-primary/30"
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-card shadow-card group-hover:bg-primary group-hover:text-primary-foreground transition-base">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs md:text-sm font-medium text-center line-clamp-1">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Flash sale */}
      <section className="container pb-10">
        <div className="rounded-2xl bg-gradient-sale p-1 shadow-sale">
          <div className="bg-card rounded-xl p-5">
            <div className="flex items-end justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl md:text-2xl font-bold">Flash Sale</h2>
                  <p className="text-xs text-muted-foreground">Kết thúc sau 02:18:45</p>
                </div>
              </div>
              <Link to="/products" className="text-sm text-secondary font-medium hover:underline hidden sm:inline">Xem thêm →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {(flash?.items ?? []).map((p) => <ProductCard key={p.id} product={p} compact />)}
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container pb-16">
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Bán chạy nhất</h2>
          <Link to="/products" className="text-sm text-secondary font-medium hover:underline">Xem tất cả</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)
            : featured?.items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
