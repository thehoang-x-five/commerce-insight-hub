import { Link, useParams } from "react-router-dom";
import { newsArticles } from "@/api/news-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, User as UserIcon, Share2, Tag } from "lucide-react";
import { formatDate } from "@/lib/format";

export default function NewsDetailPage() {
  const { slug = "" } = useParams();
  const article = newsArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground mb-4">Không tìm thấy bài viết.</p>
        <Button asChild variant="outline"><Link to="/news">Về trang tin tức</Link></Button>
      </div>
    );
  }

  const related = newsArticles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <div className="container py-6 md:py-10">
      <div className="text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground">Trang chủ</Link> /{" "}
        <Link to="/news" className="hover:text-foreground">Tin tức</Link> /{" "}
        <span className="text-foreground">{article.title}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <article>
          <Badge className="bg-secondary text-secondary-foreground border-0 mb-3">{article.category}</Badge>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight mb-4">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5"><UserIcon className="h-4 w-4" /> {article.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {article.readMinutes} phút đọc</span>
            <Button size="sm" variant="ghost" className="ml-auto"><Share2 className="h-4 w-4 mr-1" /> Chia sẻ</Button>
          </div>

          <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-surface">
            <img src={article.cover} alt={article.title} className="h-full w-full object-cover" />
          </div>

          <div className="prose prose-sm max-w-none space-y-4">
            <p className="text-lg text-muted-foreground italic border-l-4 border-secondary pl-4">{article.excerpt}</p>
            {article.body.map((p, i) => (
              <p key={i} className="text-base leading-relaxed">{p}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tags.map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>

          <Button asChild variant="outline" className="mt-8">
            <Link to="/news"><ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách</Link>
          </Button>
        </article>

        <aside className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-bold mb-3">Bài viết liên quan</h3>
            <div className="space-y-3">
              {related.map((r) => (
                <Link key={r.id} to={`/news/${r.slug}`} className="flex gap-3 group">
                  <img src={r.cover} alt={r.title} className="h-16 w-20 object-cover rounded flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium line-clamp-2 group-hover:text-secondary transition-base">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(r.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-gradient-sale text-secondary-foreground">
            <h3 className="font-display font-bold mb-1">Khuyến mãi đang HOT</h3>
            <p className="text-sm opacity-90 mb-3">Giảm tới 5 triệu cho flagship 2024</p>
            <Button asChild className="w-full bg-foreground text-background hover:bg-foreground/90">
              <Link to="/promotions">Xem khuyến mãi</Link>
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
