import { useCompareStore } from "@/store/compare-store";
import { useProducts } from "@/services/queries";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, GitCompare, ArrowRight } from "lucide-react";
import { formatVnd } from "@/lib/format";

export function CompareBar() {
  const ids = useCompareStore((s) => s.ids);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const { data } = useProducts({ pageSize: 100 });
  const loc = useLocation();

  // Hide on the compare page itself & admin/bi
  if (ids.length === 0) return null;
  if (loc.pathname.startsWith("/compare") || loc.pathname.startsWith("/admin") || loc.pathname.startsWith("/bi")) return null;

  const items = ids
    .map((id) => data?.items.find((p) => p.id === id))
    .filter(Boolean) as NonNullable<typeof data>["items"];

  return (
    <div className="fixed bottom-4 inset-x-2 md:inset-x-auto md:right-4 md:left-auto z-40 max-w-3xl mx-auto md:mx-0">
      <div className="bg-card border shadow-card-hover rounded-2xl p-3 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-info/15 text-info shrink-0">
          <GitCompare className="h-4 w-4" />
        </div>
        <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-2 bg-surface rounded-lg pl-1 pr-2 py-1 shrink-0">
              <img src={p.thumbnail} alt="" className="h-8 w-8 rounded object-cover" />
              <div className="hidden sm:block min-w-0">
                <p className="text-xs font-medium line-clamp-1 max-w-[120px]">{p.name}</p>
                <p className="text-xs text-secondary font-bold">{formatVnd(p.price)}</p>
              </div>
              <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={clear} className="text-xs hidden md:inline-flex">Xóa</Button>
        <Button asChild size="sm" className="bg-info hover:bg-info/90 text-info-foreground shrink-0">
          <Link to="/compare">So sánh ({ids.length}) <ArrowRight className="h-3 w-3 ml-1" /></Link>
        </Button>
      </div>
    </div>
  );
}
