import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowRight, Calculator, CheckCircle, Clock, CreditCard, Percent, ShieldCheck } from "lucide-react";
import { useProducts } from "@/services/queries";
import { ProductCard } from "@/components/shop/ProductCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { formatVnd } from "@/lib/format";

const TERMS = [3, 6, 9, 12];

export default function InstallmentPage() {
  const { data, isLoading } = useProducts({ pageSize: 100, sort: "price-desc" });
  const installmentProducts = useMemo(
    () => data?.items.filter((p) => p.price >= 5_000_000).slice(0, 8) ?? [],
    [data],
  );
  const [productId, setProductId] = useState("");
  const [term, setTerm] = useState(6);
  const [upfront, setUpfront] = useState([20]);

  const selectedProduct = installmentProducts.find((p) => p.id === productId) ?? installmentProducts[0];
  const upfrontValue = selectedProduct ? Math.round((selectedProduct.price * upfront[0]) / 100) : 0;
  const financedValue = selectedProduct ? selectedProduct.price - upfrontValue : 0;
  const monthlyValue = Math.round(financedValue / term);

  return (
    <div className="container py-6 md:py-10">
      <section className="grid gap-6 rounded-xl border bg-card p-5 shadow-card md:grid-cols-[1fr_380px] md:p-8">
        <div className="flex flex-col justify-center">
          <Badge className="mb-4 w-fit border-0 bg-secondary text-secondary-foreground">
            <Percent className="mr-1 h-3.5 w-3.5" /> Trả góp 0%
          </Badge>
          <h1 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Mua trước, trả sau theo kỳ hạn linh hoạt
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Trang trả góp được tách riêng khỏi khuyến mãi để mô tả rõ điều kiện, kỳ hạn và ước tính số tiền trả hàng tháng.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: CreditCard, label: "0% lãi suất", desc: "Áp dụng đối tác liên kết" },
              { icon: Clock, label: "Duyệt nhanh", desc: "Phản hồi trong 15 phút" },
              { icon: ShieldCheck, label: "Minh bạch", desc: "Hiển thị trước khoản trả" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border bg-surface p-4">
                <item.icon className="mb-2 h-5 w-5 text-secondary" />
                <h3 className="font-display font-bold">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-secondary" />
            <h2 className="font-display text-lg font-bold">Ước tính trả góp</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">Sản phẩm</label>
              <Select value={selectedProduct?.id ?? ""} onValueChange={setProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  {installmentProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">Trả trước</label>
              <Slider value={upfront} min={0} max={50} step={10} onValueChange={setUpfront} />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{upfront[0]}%</span>
                <span>{formatVnd(upfrontValue)}</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">Kỳ hạn</label>
              <div className="grid grid-cols-4 gap-2">
                {TERMS.map((month) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => setTerm(month)}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-base ${
                      term === month ? "border-secondary bg-secondary text-secondary-foreground" : "hover:border-secondary/60"
                    }`}
                  >
                    {month}T
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-surface p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giá sản phẩm</span>
                <strong>{formatVnd(selectedProduct?.price ?? 0)}</strong>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Số tiền góp</span>
                <strong>{formatVnd(financedValue)}</strong>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-xs text-muted-foreground">Tạm tính mỗi tháng</p>
                <p className="font-display text-2xl font-extrabold text-secondary">{formatVnd(monthlyValue)}</p>
              </div>
            </div>

            <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to={selectedProduct ? `/products/${selectedProduct.slug}` : "/products"}>
                Xem sản phẩm <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          "Chọn sản phẩm có hỗ trợ trả góp và kiểm tra giá trị đơn hàng.",
          "Chọn kỳ hạn, mức trả trước và đối tác thanh toán phù hợp.",
          "Hoàn tất thông tin tại bước thanh toán, nhân viên xác nhận hồ sơ.",
        ].map((step, index) => (
          <Card key={step} className="p-5">
            <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">
              {index + 1}
            </div>
            <p className="text-sm text-muted-foreground">{step}</p>
          </Card>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Sản phẩm phù hợp trả góp</h2>
            <p className="text-sm text-muted-foreground">Ưu tiên các sản phẩm giá trị cao như điện thoại, laptop, tablet và TV.</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-success" /> Lãi suất 0% tùy chương trình
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {installmentProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </div>
  );
}
