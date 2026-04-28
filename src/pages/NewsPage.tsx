import { Link } from "react-router-dom";
import { useState } from "react";
import { newsArticles } from "@/api/news-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";
import { formatDate } from "@/lib/format";

const CATEGORIES = ["Tất cả", "Đánh giá", "Khuyến mãi", "Thủ thuật", "Tin công nghệ"] as const;

export default function NewsPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Tất cả");
  const [q, setQ] = useState("");

  const list = newsArticles.filter(
    (a) =>
      (cat === "Tất cả" || a.category === cat) &&
      (!q || a.title.toLowerCase().includes(q.toLowerCase()) || a.excerpt.toLowerCase().includes(q.toLowerCase())),
  );
  const featured = list[0];
  const rest = list.slice(1);

  return (
    <div className="container py-6 md:py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Newspaper className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Tin tức công nghệ</h1>
          <p className="text-sm text-muted-foreground">Cập nhật mới nhất từ TGDĐ</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Tìm bài viết..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={cat === c ? "default" : "outline"}
              onClick={() => setCat(c)}
              className={cat === c ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : ""}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {!featured ? (
        <Card className="p-12 text-center text-muted-foreground">Không có bài viết phù hợp.</Card>
      ) : (
        <>
          {/* Featured */}
          <Link to={`/news/${featured.slug}`}>
            <Card className="overflow-hidden hover:shadow-card-hover transition-base mb-6 grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto bg-surface">
                <img src={featured.cover} alt={featured.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <Badge className="bg-secondary text-secondary-foreground border-0 w-fit mb-3">{featured.category}</Badge>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 leading-tight">{featured.title}</h2>
                <p className="text-muted-foreground mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(featured.publishedAt)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readMinutes} phút đọc</span>
                  <span>Bởi <strong>{featured.author}</strong></span>
                </div>
                <span className="text-secondary font-medium text-sm mt-4 flex items-center gap-1">
                  Đọc bài viết <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Card>
          </Link>

          {/* Rest */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((a) => (
              <Link key={a.id} to={`/news/${a.slug}`}>
                <Card className="overflow-hidden hover:shadow-card-hover transition-base h-full">
                  <div className="aspect-video bg-surface overflow-hidden">
                    <img src={a.cover} alt={a.title} className="h-full w-full object-cover hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2">{a.category}</Badge>
                    <h3 className="font-display font-bold mb-2 line-clamp-2 leading-snug">{a.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{a.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(a.publishedAt)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readMinutes}p</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
