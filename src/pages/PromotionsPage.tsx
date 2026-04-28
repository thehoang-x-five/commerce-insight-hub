import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { promotions } from "@/api/news-data";
import { COUPONS } from "@/lib/coupons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Copy, Check, Gift, Tag, Clock } from "lucide-react";
import { toast } from "sonner";

function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, +new Date(to) - now);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);

  return (
    <div className="flex items-center gap-1.5 text-xs">
      {[
        { v: d, l: "ngày" },
        { v: h, l: "giờ" },
        { v: m, l: "phút" },
        { v: s, l: "giây" },
      ].map((u) => (
        <div key={u.l} className="bg-foreground text-background px-2 py-1 rounded font-mono font-bold tabular-nums">
          {String(u.v).padStart(2, "0")}<span className="ml-1 opacity-70 font-normal">{u.l}</span>
        </div>
      ))}
    </div>
  );
}

export default function PromotionsPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`Đã sao chép mã ${code}`);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="container py-6 md:py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Khuyến mãi nổi bật</h1>
          <p className="text-sm text-muted-foreground">Cập nhật ưu đãi mới nhất từ TGDĐ</p>
        </div>
      </div>

      {/* Vouchers */}
      <Card className="p-5 mb-6">
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Tag className="h-4 w-4 text-secondary" /> Mã giảm giá
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COUPONS.map((c) => (
            <div
              key={c.code}
              className="relative rounded-lg border-2 border-dashed border-secondary/40 bg-secondary/5 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="font-display font-extrabold text-lg text-secondary">{c.code}</div>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copy(c.code)}>
                  {copied === c.code ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
              {c.min ? (
                <p className="text-xs mt-2 text-foreground/60">Đơn từ {(c.min / 1_000_000).toFixed(0)} triệu</p>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      {/* Promo cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {promotions.map((p) => (
          <Card key={p.id} className="overflow-hidden hover:shadow-card-hover transition-base">
            <div className="aspect-video bg-surface relative overflow-hidden">
              <img src={p.cover} alt={p.title} className="h-full w-full object-cover" />
              <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground border-0">{p.badge}</Badge>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-display text-lg font-bold">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.description}</p>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-sale text-secondary-foreground">
                <Gift className="h-5 w-5" />
                <span className="font-display font-bold">{p.discountText}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Kết thúc sau:</span>
                <Countdown to={p.endsAt} />
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Điều kiện:</p>
                {p.conditions.map((c) => (
                  <p key={c} className="flex gap-2"><span>•</span>{c}</p>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                {p.couponCode && (
                  <Button variant="outline" onClick={() => copy(p.couponCode!)} className="flex-1">
                    {copied === p.couponCode ? <Check className="h-4 w-4 mr-1 text-success" /> : <Copy className="h-4 w-4 mr-1" />}
                    {p.couponCode}
                  </Button>
                )}
                <Button asChild className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Link to="/products">Mua ngay</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
