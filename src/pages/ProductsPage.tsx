import { useSearchParams } from "react-router-dom";
import { useProducts, useCategories } from "@/services/queries";
import { ProductCard } from "@/components/shop/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { formatVnd } from "@/lib/format";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

const SORTS = [
  { value: "popular", label: "Phổ biến" },
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "rating", label: "Đánh giá cao" },
];
const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const categoryId = params.get("category") || "all";
  const search = params.get("search") || "";
  const sort = (params.get("sort") as any) || "popular";
  const page = parseInt(params.get("page") || "1");

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60_000_000]);
  const [brand, setBrand] = useState<string>("all");

  useEffect(() => { setBrand("all"); }, [categoryId]);

  const { data: categories } = useCategories();
  const { data, isLoading } = useProducts({
    categoryId, search, sort, brand,
    minPrice: priceRange[0], maxPrice: priceRange[1],
    page, pageSize: PAGE_SIZE,
  });

  // Need brands list (from full unfiltered set within current category)
  const { data: brandsData } = useProducts({ categoryId, pageSize: 100 });
  const brands = useMemo(() => {
    const s = new Set(brandsData?.items.map((p) => p.brand));
    return Array.from(s);
  }, [brandsData]);

  const updateParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (!v || v === "all") next.delete(k); else next.set(k, v);
    if (k !== "page") next.delete("page"); // reset page on filter change
    setParams(next, { replace: true });
  };

  const goPage = (p: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeCategory = categories?.find((c) => c.id === categoryId);
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="container py-6 md:py-10">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Trang chủ</span> / <span className="text-foreground">{activeCategory?.name || "Tất cả sản phẩm"}</span>
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
        {search ? `Kết quả cho "${search}"` : activeCategory?.name || "Tất cả sản phẩm"}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">{data?.total ?? 0} sản phẩm</p>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Filters */}
        <aside className="space-y-5 bg-card border rounded-xl p-4 h-fit lg:sticky lg:top-32">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Bộ lọc</h3>
            {(categoryId !== "all" || brand !== "all" || search) && (
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setParams({})}>
                <X className="h-3 w-3 mr-1" /> Xóa
              </Button>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Danh mục</label>
            <Select value={categoryId} onValueChange={(v) => updateParam("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {brands.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Thương hiệu</label>
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  variant={brand === "all" ? "default" : "outline"}
                  onClick={() => setBrand("all")}
                  className="cursor-pointer"
                >Tất cả</Badge>
                {brands.map((b) => (
                  <Badge
                    key={b}
                    variant={brand === b ? "default" : "outline"}
                    onClick={() => setBrand(b)}
                    className="cursor-pointer"
                  >{b}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Khoảng giá</label>
            <Slider
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              min={0} max={60_000_000} step={500_000}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatVnd(priceRange[0])}</span>
              <span>{formatVnd(priceRange[1])}</span>
            </div>
          </div>

          <div className="pt-3 border-t">
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Đánh giá</label>
            <div className="space-y-1">
              {[5, 4, 3].map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer hover:text-secondary">
                  <input type="checkbox" className="accent-secondary" /> Từ {s} sao trở lên
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Hiển thị {data ? Math.min((page - 1) * PAGE_SIZE + 1, data.total) : 0}–{data ? Math.min(page * PAGE_SIZE, data.total) : 0} / {data?.total ?? 0}
            </span>
            <Select value={sort} onValueChange={(v) => updateParam("sort", v)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
            </div>
          ) : data && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 animate-fade-in">
                {data.items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-1.5">
                  <Button variant="outline" size="icon" disabled={page === 1} onClick={() => goPage(page - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    // show first, last, current ±1, ellipsis
                    const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                    const showEllipsis = (p === page - 2 || p === page + 2) && totalPages > 5;
                    if (!show && !showEllipsis) return null;
                    if (showEllipsis) return <span key={p} className="px-2 text-muted-foreground">…</span>;
                    return (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="icon"
                        className={p === page ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" : ""}
                        onClick={() => goPage(p)}
                      >
                        {p}
                      </Button>
                    );
                  })}
                  <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => goPage(page + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</div>
          )}
        </div>
      </div>
    </div>
  );
}
