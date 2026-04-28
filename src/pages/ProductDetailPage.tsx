import { useParams, Link } from "react-router-dom";
import { useProduct, useProductReviews } from "@/services/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import {
  Star, ShoppingCart, Truck, ShieldCheck, RotateCcw, Minus, Plus,
  Heart, GitCompare, Share2, MessageCircle, Gift, Droplet, CreditCard,
  Check, Sparkles, Package,
} from "lucide-react";
import { formatVnd, formatDate } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCompareStore } from "@/store/compare-store";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  productVariants, DEFAULT_VARIANTS, accessories, combos,
  protectionServices, exclusivePerks, installmentPlans, calcMonthly,
} from "@/api/news-data";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: reviews } = useProductReviews(product?.id || "");
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const variants = useMemo(() => productVariants[slug] ?? DEFAULT_VARIANTS, [slug]);
  const [colorIdx, setColorIdx] = useState(0);
  const [storageIdx, setStorageIdx] = useState(0);
  const [pickedAccessories, setPickedAccessories] = useState<string[]>([]);
  const [pickedProtections, setPickedProtections] = useState<string[]>([]);
  const [pickedCombo, setPickedCombo] = useState<string | null>(null);

  const add = useCartStore((s) => s.add);
  const openCart = useUiStore((s) => s.openCart);
  const wished = useWishlistStore((s) => (product ? s.ids.includes(product.id) : false));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const compared = useCompareStore((s) => (product ? s.ids.includes(product.id) : false));
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

  const finalPrice = product.price + (variants.storages[storageIdx]?.priceDelta ?? 0);
  const accessoriesTotal = accessories.filter((a) => pickedAccessories.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const protectionsTotal = protectionServices.filter((p) => pickedProtections.includes(p.id)).reduce((s, p) => s + p.price, 0);
  const comboBonus = pickedCombo ? combos.find((c) => c.id === pickedCombo)?.totalPrice ?? 0 : 0;
  const grandTotal = finalPrice * qty + accessoriesTotal + protectionsTotal + comboBonus;

  const handleAdd = () => {
    add(product.id, qty);
    toast.success(`Đã thêm ${qty} × "${product.name}" vào giỏ`);
  };

  return (
    <div className="container py-6 md:py-10">
      <div className="text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground">Trang chủ</Link> /{" "}
        <Link to="/products" className="hover:text-foreground">{variants === DEFAULT_VARIANTS ? "Sản phẩm" : "Điện thoại"}</Link> /{" "}
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
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{product.brand}</Badge>
            {product.tags.map((t) => <Badge key={t} className="bg-secondary text-secondary-foreground border-0">{t}</Badge>)}
            <span className="text-xs text-muted-foreground">Chính hãng VN/A · Nguyên seal</span>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold">
            {product.name}
            {variants !== DEFAULT_VARIANTS && variants.storages[storageIdx] ? ` · ${variants.storages[storageIdx].label}` : ""}
          </h1>

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
              <span className="text-3xl font-display font-extrabold">{formatVnd(finalPrice)}</span>
              {product.originalPrice && (
                <>
                  <span className="line-through opacity-70">{formatVnd(product.originalPrice + (variants.storages[storageIdx]?.priceDelta ?? 0))}</span>
                  <Badge className="bg-primary text-primary-foreground border-0">-{product.discountPercent}%</Badge>
                </>
              )}
            </div>
            <p className="text-xs mt-1 opacity-90">
              Giá đã bao gồm VAT · Trả góp 0% từ <strong>{formatVnd(finalPrice / 12)}/tháng</strong>
            </p>
          </div>

          {/* Stock & shipping notice */}
          <div className="bg-success/10 border border-success/30 rounded-lg p-3 flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-success">Còn hàng — Giao trong 2h</p>
              <p className="text-xs text-muted-foreground">Kho 47 sản phẩm tại Hà Nội · Đổi trả 30 ngày</p>
            </div>
          </div>

          {/* Color picker */}
          <div>
            <p className="text-sm font-semibold mb-2">Chọn màu sắc:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {variants.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setColorIdx(i)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 transition-base ${
                    colorIdx === i ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/40"
                  }`}
                >
                  <span className="h-6 w-6 rounded-full border shadow-sm shrink-0" style={{ background: c.hex }} />
                  <span className="text-xs font-medium truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Storage picker */}
          {variants.storages.length > 1 && (
            <div>
              <p className="text-sm font-semibold mb-2">Chọn dung lượng:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {variants.storages.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setStorageIdx(i)}
                    className={`p-3 rounded-lg border-2 text-center transition-base ${
                      storageIdx === i ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/40"
                    }`}
                  >
                    <p className="font-display font-bold">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{formatVnd(product.price + s.priceDelta)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Installment summary box */}
          <Card className="p-4 border-info/30 bg-info/5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-info" />
                <p className="font-semibold text-sm">Thông tin trả góp</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="link" className="h-auto p-0 text-info">Xem chi tiết →</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Phương thức trả góp 0% & lãi suất ưu đãi</DialogTitle>
                    <DialogDescription>
                      Áp dụng cho {product.name}. Chọn gói phù hợp với khả năng tài chính.
                    </DialogDescription>
                  </DialogHeader>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Đối tác</TableHead>
                        <TableHead>Kỳ hạn</TableHead>
                        <TableHead>Trả trước</TableHead>
                        <TableHead>Lãi suất</TableHead>
                        <TableHead className="text-right">Trả hàng tháng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {installmentPlans.map((plan, i) => {
                        const r = calcMonthly(finalPrice, plan);
                        return (
                          <TableRow key={i}>
                            <TableCell><Badge variant="outline">{plan.partner}</Badge></TableCell>
                            <TableCell>{plan.months} tháng</TableCell>
                            <TableCell>{plan.prepayPercent}% ({formatVnd(r.prepay)})</TableCell>
                            <TableCell>{plan.interestRate === 0 ? <span className="text-success font-semibold">0%</span> : `${plan.interestRate}%/tháng`}</TableCell>
                            <TableCell className="text-right font-display font-bold text-secondary">{formatVnd(r.monthly)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <p className="text-xs text-muted-foreground">
                    * Cần CMND/CCCD, lương từ 4 triệu/tháng, hoặc thẻ tín dụng còn hạn mức. Duyệt trong 15 phút.
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Trả trước 0%</p>
                <p className="font-display font-bold">{formatVnd(finalPrice / 12)}/tháng × 12</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trả trước 20%</p>
                <p className="font-display font-bold">{formatVnd((finalPrice * 0.8) / 12)}/tháng × 12</p>
              </div>
            </div>
          </Card>

          {/* Mini service badges */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[{ Icon: Truck, t: "Giao nhanh 2h" }, { Icon: ShieldCheck, t: "Chính hãng 100%" }, { Icon: RotateCcw, t: "Đổi trả 30 ngày" }].map(({ Icon, t }) => (
              <div key={t} className="flex items-center gap-2 p-2 rounded-lg bg-surface">
                <Icon className="h-4 w-4 text-success" /> {t}
              </div>
            ))}
          </div>

          {/* Quantity & actions */}
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

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button size="lg" variant="outline" onClick={handleAdd}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Thêm vào giỏ
            </Button>
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sale"
              onClick={() => { handleAdd(); openCart(); }}
            >
              Mua ngay
            </Button>
            <Button asChild size="lg" className="col-span-2 bg-warning text-warning-foreground hover:bg-warning/90">
              <a href="https://zalo.me" target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4 mr-2" /> Tư vấn qua Zalo</a>
            </Button>
            <div className="col-span-2 flex gap-2">
              <Button variant="outline" className={`flex-1 ${wished ? "border-secondary text-secondary" : ""}`}
                onClick={() => { toggleWish(product.id); toast.success(wished ? "Bỏ yêu thích" : "Đã thêm yêu thích"); }}>
                <Heart className={`h-4 w-4 mr-2 ${wished ? "fill-secondary" : ""}`} /> {wished ? "Đã yêu thích" : "Yêu thích"}
              </Button>
              <Button variant="outline" className={`flex-1 ${compared ? "border-info text-info" : ""}`}
                onClick={() => toggleCompare(product.id)}>
                <GitCompare className="h-4 w-4 mr-2" /> So sánh
              </Button>
              <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>

      {/* Promo strip */}
      <Card className="mt-6 p-4 bg-gradient-to-r from-secondary/15 via-warning/10 to-primary/15 border-secondary/30">
        <p className="font-display font-bold mb-1 flex items-center gap-2"><Sparkles className="h-4 w-4 text-secondary" /> Mua kèm phụ kiện — Giảm đến 30%</p>
        <p className="text-sm text-muted-foreground">Chọn phụ kiện bên dưới để nhận ưu đãi đặc biệt.</p>
      </Card>

      {/* Combos */}
      <section className="mt-6">
        <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Gói combo tiết kiệm</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {combos.map((c) => (
            <button
              key={c.id}
              onClick={() => setPickedCombo(pickedCombo === c.id ? null : c.id)}
              className={`text-left p-4 rounded-xl border-2 transition-base ${
                pickedCombo === c.id ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-display font-bold">{c.title}</p>
                {pickedCombo === c.id && <Check className="h-4 w-4 text-secondary shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{c.description}</p>
              <ul className="text-xs space-y-1 mb-2">
                {c.itemNames.map((i) => <li key={i} className="flex gap-1.5"><span className="text-success">✓</span>{i}</li>)}
              </ul>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-secondary">{formatVnd(c.totalPrice)}</span>
                <span className="text-xs text-muted-foreground line-through">{formatVnd(c.originalPrice)}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Accessories */}
      <section className="mt-6">
        <h2 className="font-display font-bold text-lg mb-3">Hoặc chọn từng phụ kiện</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {accessories.map((a) => {
            const checked = pickedAccessories.includes(a.id);
            return (
              <label
                key={a.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-base ${
                  checked ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/40"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) =>
                    setPickedAccessories((prev) => (c ? [...prev, a.id] : prev.filter((x) => x !== a.id)))
                  }
                />
                <img src={a.thumbnail} className="h-10 w-10 rounded object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{a.name}</p>
                  <p className="text-xs text-secondary font-bold">{formatVnd(a.price)}</p>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Protection services */}
      <section className="mt-6">
        <h2 className="font-display font-bold text-lg mb-3">Dịch vụ bổ sung</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {protectionServices.map((p) => {
            const checked = pickedProtections.includes(p.id);
            const Icon = p.icon === "shield" ? ShieldCheck : Droplet;
            return (
              <label
                key={p.id}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-base ${
                  checked ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/40"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) =>
                    setPickedProtections((prev) => (c ? [...prev, p.id] : prev.filter((x) => x !== p.id)))
                  }
                  className="mt-0.5"
                />
                <Icon className="h-5 w-5 text-info mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                  <p className="text-sm text-secondary font-bold mt-1">+{formatVnd(p.price)}</p>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Tabs description / specs / reviews */}
      <Tabs defaultValue="desc" className="mt-10">
        <TabsList>
          <TabsTrigger value="desc">Mô tả sản phẩm</TabsTrigger>
          <TabsTrigger value="specs">Thông số kỹ thuật</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({reviews?.length || 0})</TabsTrigger>
          <TabsTrigger value="qa">Hỏi đáp</TabsTrigger>
        </TabsList>

        <TabsContent value="desc" className="bg-card border rounded-xl p-6 leading-relaxed text-sm">
          <p className="mb-4">{product.description}</p>
          <h3 className="font-display font-bold mb-2 mt-4">Điểm nổi bật:</h3>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>📱 Chip A17 Pro 3nm - Hiệu năng vượt trội, tiết kiệm pin</li>
            <li>📷 Camera chính 48MP với zoom quang tới 5x, kèm AI xử lý ảnh thông minh</li>
            <li>🎬 Quay video ProRes, Apple Log cho ngày sáng tạo</li>
            <li>🔋 Pin {product.specs["Pin"] ?? "siêu bền"}, sử dụng cả ngày dài</li>
            <li>🛡️ Khung Titan cao cấp, USB-C tốc độ cao</li>
            <li>🔐 Nút Action tuỳ biến, USB-C tốc độ cao</li>
          </ul>
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
          <div className="flex items-center gap-6 pb-4 border-b">
            <div className="text-center">
              <p className="font-display text-4xl font-extrabold text-secondary">{product.rating.toFixed(1)}</p>
              <div className="flex justify-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-warning text-warning" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{product.reviewCount} đánh giá</p>
            </div>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Viết đánh giá</Button>
          </div>
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

        <TabsContent value="qa" className="bg-card border rounded-xl p-6 text-sm space-y-3">
          {[
            { q: "Sản phẩm có bảo hành chính hãng không?", a: "Có. Bảo hành chính hãng 12 tháng tại trung tâm uỷ quyền của hãng trên toàn quốc." },
            { q: "Mua trả góp cần điều kiện gì?", a: "Bạn cần CMND/CCCD và một trong các giấy tờ: hộ khẩu, bằng lái xe, hoặc thẻ tín dụng. Duyệt trong 15 phút." },
            { q: "Giao hàng trong bao lâu?", a: "Nội thành TP.HCM/Hà Nội: trong 2 giờ. Các tỉnh khác: 1-3 ngày." },
          ].map((item) => (
            <details key={item.q} className="group border rounded-lg p-3">
              <summary className="font-medium cursor-pointer flex items-center justify-between">
                {item.q}
                <Plus className="h-4 w-4 group-open:rotate-45 transition-transform" />
              </summary>
              <p className="mt-2 text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </TabsContent>
      </Tabs>

      {/* Exclusive perks */}
      <Card className="mt-8 p-5 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
        <p className="text-center font-display font-bold mb-3 flex items-center justify-center gap-2">
          <Gift className="h-5 w-5 text-primary" /> Ưu đãi độc quyền tại Thế Giới Di Động
        </p>
        <div className="grid grid-cols-3 gap-3">
          {exclusivePerks.map((perk) => (
            <Card key={perk.title} className="p-4 text-center bg-card">
              <p className="text-xs text-muted-foreground">{perk.title}</p>
              <p className="font-display text-xl font-extrabold text-secondary my-1">{perk.value}</p>
              <p className="text-xs text-muted-foreground">{perk.desc}</p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Sticky cart total */}
      <div className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-30 bg-card shadow-card-hover border rounded-full px-4 py-2 hidden lg:flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">Tổng dự kiến:</span>
        <span className="font-display font-bold text-secondary">{formatVnd(grandTotal)}</span>
        <Button size="sm" className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => { handleAdd(); openCart(); }}>
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
