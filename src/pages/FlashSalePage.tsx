import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock, Flame, ShieldCheck, Tag, Zap } from "lucide-react";
import { useProducts } from "@/services/queries";
import { ProductCard } from "@/components/shop/ProductCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { formatVnd } from "@/lib/format";

const FLASH_END = "2026-05-05T23:59:59+07:00";

function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const ms = Math.max(0, +new Date(to) - now);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);

  return (
    <div className="flex items-center gap-2">
      {[
        { value: h, label: "giờ" },
        { value: m, label: "phút" },
        { value: s, label: "giây" },
      ].map((item) => (
        <div key={item.label} className="min-w-16 rounded-lg bg-foreground px-2 py-2 text-center text-background shadow-sm">
          <div className="font-display text-lg font-extrabold tabular-nums">{String(item.value).padStart(2, "0")}</div>
          <div className="text-[10px] uppercase tracking-wide opacity-70">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function FlashSalePage() {
  const { data, isLoading } = useProducts({ pageSize: 100, sort: "popular" });
  const flashProducts = useMemo(() => data?.items.filter((p) => p.isFlashSale) ?? [], [data]);
  const heroProduct = flashProducts[0];

  return (
    <div className="container py-6 md:py-10">
      <section className="overflow-hidden rounded-xl border bg-card shadow-card">
        <div className="grid gap-6 bg-gradient-sale p-5 text-secondary-foreground md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div className="flex flex-col justify-center">
            <Badge className="mb-4 w-fit border-0 bg-foreground text-background">
              <Flame className="mr-1 h-3.5 w-3.5" /> Deal trong ngày
            </Badge>
            <h1 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
              Flash Sale thiết bị công nghệ
            </h1>
            <p className="mt-3 max-w-xl text-sm text-secondary-foreground/80 md:text-base">
              Các sản phẩm đang giảm sâu được tách riêng khỏi trang danh mục để người dùng xem deal nhanh hơn.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Countdown to={FLASH_END} />
              <Button asChild className="w-fit bg-foreground text-background hover:bg-foreground/90">
                <a href="#flash-products">Xem deal <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-background/90 p-4 text-foreground shadow-card">
            {heroProduct ? (
              <div className="grid grid-cols-[120px_1fr] gap-4 sm:grid-cols-[160px_1fr]">
                <Link to={`/products/${heroProduct.slug}`} className="aspect-square overflow-hidden rounded-lg bg-surface">
                  <img src={heroProduct.thumbnail} alt={heroProduct.name} className="h-full w-full object-cover" />
                </Link>
                <div className="min-w-0">
                  <Badge className="mb-2 border-0 bg-secondary text-secondary-foreground">Hot deal</Badge>
                  <h2 className="line-clamp-2 font-display text-lg font-bold">{heroProduct.name}</h2>
                  <p className="mt-2 text-2xl font-extrabold text-secondary">{formatVnd(heroProduct.price)}</p>
                  {heroProduct.originalPrice ? (
                    <p className="text-sm text-muted-foreground line-through">{formatVnd(heroProduct.originalPrice)}</p>
                  ) : null}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Đã bán {heroProduct.soldCount.toLocaleString("vi-VN")}</span>
                      <span>Còn {heroProduct.stock}</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </div>
              </div>
            ) : (
              <Skeleton className="h-44 rounded-lg" />
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          { icon: Zap, title: "Giảm sâu theo khung giờ", desc: "Ưu tiên các sản phẩm có nhãn Flash." },
          { icon: ShieldCheck, title: "Hàng chính hãng", desc: "Bảo hành theo chính sách TGDĐ." },
          { icon: Tag, title: "Áp thêm mã giảm", desc: "Có thể kết hợp voucher hợp lệ khi thanh toán." },
        ].map((item) => (
          <Card key={item.title} className="p-4">
            <item.icon className="mb-3 h-5 w-5 text-secondary" />
            <h3 className="font-display font-bold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </Card>
        ))}
      </section>

      <section id="flash-products" className="mt-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Sản phẩm Flash Sale</h2>
            <p className="text-sm text-muted-foreground">Danh sách riêng cho tab Flash Sale, không dùng chung trang sản phẩm.</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> Cập nhật liên tục theo tồn kho
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {flashProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </div>
  );
}
