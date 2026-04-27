import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  useBiKpi, useBiRevenue, useBiCategory, useBiChannel, useBiRegion, useBiTopProducts,
} from "@/services/queries";
import { formatCompactVnd, formatNumber, formatPercent, formatVnd } from "@/lib/format";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, ShoppingBag, Users, DollarSign, Activity, Target,
  Filter, Download, ArrowLeft, Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { BiFilters } from "@/types/domain";

const RANGES = [
  { v: "7", label: "7 ngày" },
  { v: "30", label: "30 ngày" },
  { v: "90", label: "90 ngày" },
];
const CHANNELS = ["all", "Website", "App", "Marketplace", "Offline"];
const REGIONS = ["all", "TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Khác"];
const COLORS = ["hsl(var(--chart-1))","hsl(var(--chart-2))","hsl(var(--chart-3))","hsl(var(--chart-4))","hsl(var(--chart-5))","hsl(var(--chart-6))","hsl(var(--chart-1))"];

export default function BiDashboardPage() {
  const [range, setRange] = useState("30");
  const [channel, setChannel] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [topSearch, setTopSearch] = useState("");

  const filters: BiFilters = useMemo(() => {
    const days = parseInt(range);
    const today = new Date();
    return {
      from: new Date(today.getTime() - (days - 1) * 86400000).toISOString().slice(0, 10),
      to: today.toISOString().slice(0, 10),
      channel: channel as any, region,
    };
  }, [range, channel, region]);

  const { data: kpi } = useBiKpi(filters);
  const { data: series } = useBiRevenue(filters);
  const { data: cats } = useBiCategory(filters);
  const { data: channels } = useBiChannel(filters);
  const { data: regions } = useBiRegion(filters);
  const { data: top } = useBiTopProducts(filters);

  const kpiCards = kpi ? [
    { icon: DollarSign, label: "Doanh thu", value: formatCompactVnd(kpi.revenue), growth: kpi.revenueGrowth, level: "Strategic", color: "from-chart-1/20 to-chart-1/0", iconBg: "bg-chart-1/15 text-chart-1" },
    { icon: ShoppingBag, label: "Số đơn hàng", value: formatNumber(kpi.orders), growth: kpi.ordersGrowth, level: "Operational", color: "from-chart-2/20 to-chart-2/0", iconBg: "bg-chart-2/15 text-chart-2" },
    { icon: Activity, label: "AOV (Giá trị TB)", value: formatCompactVnd(kpi.aov), growth: kpi.aovGrowth, level: "Tactical", color: "from-chart-3/20 to-chart-3/0", iconBg: "bg-chart-3/15 text-chart-3" },
    { icon: Users, label: "Khách hàng mới", value: formatNumber(kpi.customers), growth: kpi.customersGrowth, level: "Strategic", color: "from-chart-4/20 to-chart-4/0", iconBg: "bg-chart-4/15 text-chart-4" },
    { icon: Target, label: "Tỷ lệ chuyển đổi", value: `${kpi.conversionRate.toFixed(2)}%`, growth: kpi.conversionGrowth, level: "Tactical", color: "from-chart-5/20 to-chart-5/0", iconBg: "bg-chart-5/15 text-chart-5" },
  ] : [];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-30">
        <div className="container py-3 flex items-center gap-3 flex-wrap">
          <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="h-4 w-4 mr-1" /> Website</Link></Button>
          <div className="hidden md:block h-6 w-px bg-border" />
          <div>
            <h1 className="font-display text-lg md:text-xl font-bold leading-tight">Revenue & Growth Dashboard</h1>
            <p className="text-xs text-muted-foreground">Báo cáo BI · TGDĐ · Cập nhật {new Date().toLocaleString("vi-VN")}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{RANGES.map((r) => <SelectItem key={r.v} value={r.v}>{r.label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{CHANNELS.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "Tất cả kênh" : c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{REGIONS.map((r) => <SelectItem key={r} value={r}>{r === "all" ? "Toàn quốc" : r}</SelectItem>)}</SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={() => {
              if (!series) return;
              const rows = [["Ngày","Doanh thu","Đơn hàng","Lượt truy cập"], ...series.map(s => [s.date, String(s.revenue), String(s.orders), String(s.visitors)])];
              const csv = "\uFEFF" + rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = `bi-revenue-${Date.now()}.csv`; a.click();
              URL.revokeObjectURL(url);
            }}><Download className="h-3.5 w-3.5 mr-1" /> Export CSV</Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* KPI cards */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {kpiCards.map((c) => {
              const up = c.growth >= 0;
              return (
                <Card key={c.label} className={`p-4 bg-gradient-to-br ${c.color} relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`grid h-9 w-9 place-items-center rounded-lg ${c.iconBg}`}>
                      <c.icon className="h-4 w-4" />
                    </div>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{c.level}</Badge>
                  </div>
                  <p className="text-2xl font-display font-bold leading-tight">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
                  <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${up ? "text-success" : "text-destructive"}`}>
                    {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {formatPercent(c.growth)} <span className="text-muted-foreground">vs kỳ trước</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Charts row 1 */}
        <section className="grid lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold">Doanh thu & đơn hàng theo ngày</h3>
                <p className="text-xs text-muted-foreground">Hỗ trợ ra quyết định Operational/Tactical</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.45} /><stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.35} /><stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="l" tickFormatter={(v) => formatCompactVnd(v)} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="r" orientation="right" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(v: number, name: string) => name === "revenue" ? [formatVnd(v), "Doanh thu"] : [formatNumber(v), "Đơn"]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area yAxisId="l" name="Doanh thu" type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fill="url(#g1)" strokeWidth={2} />
                <Area yAxisId="r" name="Đơn hàng" type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-bold mb-1">Cơ cấu danh mục</h3>
            <p className="text-xs text-muted-foreground mb-3">Strategic — danh mục dẫn dắt doanh thu</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={cats} dataKey="revenue" nameKey="category" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {cats?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatVnd(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2 max-h-32 overflow-y-auto">
              {cats?.map((c, i) => (
                <div key={c.category} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} /> {c.category}</span>
                  <span className="font-semibold">{c.share.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Charts row 2 */}
        <section className="grid lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-display font-bold mb-1">Doanh thu theo kênh bán</h3>
            <p className="text-xs text-muted-foreground mb-3">Tactical — tối ưu phân bổ ngân sách</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={channels}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="channel" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={(v) => formatCompactVnd(v)} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => formatVnd(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {channels?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-bold mb-1">Khu vực địa lý</h3>
            <p className="text-xs text-muted-foreground mb-3">Strategic — mở rộng thị trường</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={regions} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tickFormatter={(v) => formatCompactVnd(v)} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="region" fontSize={11} width={70} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => formatVnd(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </section>

        {/* Conversion / visitors mini */}
        <section className="grid lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-3">
            <h3 className="font-display font-bold mb-1">Lưu lượng truy cập</h3>
            <p className="text-xs text-muted-foreground mb-3">Operational — theo dõi sức khỏe traffic hằng ngày</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => formatCompactVnd(v).replace(" tỷ", "B").replace(" tr", "M")} />
                <Tooltip formatter={(v: number) => formatNumber(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Line type="monotone" dataKey="visitors" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </section>

        {/* Top products drill-down */}
        <section>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-display font-bold">Top sản phẩm bán chạy (Drill-down)</h3>
                <p className="text-xs text-muted-foreground">Operational/Tactical — quyết định nhập hàng & promotion</p>
              </div>
              <Input placeholder="Tìm sản phẩm..." className="w-48 h-9" value={topSearch} onChange={(e) => setTopSearch(e.target.value)} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="text-left py-2 pl-2">#</th>
                    <th className="text-left">Sản phẩm</th>
                    <th className="text-left">Danh mục</th>
                    <th className="text-right">SL bán</th>
                    <th className="text-right">Doanh thu</th>
                    <th className="text-right pr-2">Tăng trưởng</th>
                  </tr>
                </thead>
                <tbody>
                  {top?.filter((r) => r.name.toLowerCase().includes(topSearch.toLowerCase())).map((row, i) => {
                    const up = row.growth >= 0;
                    return (
                      <tr key={row.productId} className="border-b last:border-0 hover:bg-muted/40">
                        <td className="py-2.5 pl-2 text-muted-foreground">{i + 1}</td>
                        <td className="font-medium max-w-xs truncate">{row.name}</td>
                        <td><Badge variant="outline">{row.category}</Badge></td>
                        <td className="text-right">{formatNumber(row.unitsSold)}</td>
                        <td className="text-right font-semibold text-secondary">{formatVnd(row.revenue)}</td>
                        <td className={`text-right pr-2 font-medium ${up ? "text-success" : "text-destructive"}`}>{formatPercent(row.growth)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Decision matrix */}
        <section>
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h3 className="font-display font-bold mb-3 flex items-center gap-2"><Info className="h-4 w-4 text-info" /> Báo cáo này hỗ trợ ra quyết định ở 3 cấp</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { lvl: "Operational", color: "border-chart-2/40 bg-chart-2/5", desc: "Theo dõi đơn hàng/traffic hằng ngày, phát hiện bất thường, điều phối kho/vận chuyển." },
                { lvl: "Tactical", color: "border-chart-3/40 bg-chart-3/5", desc: "Phân bổ ngân sách marketing theo kênh, điều chỉnh giá/khuyến mãi theo danh mục." },
                { lvl: "Strategic", color: "border-chart-1/40 bg-chart-1/5", desc: "Quyết định mở rộng thị trường mới, đầu tư danh mục dẫn dắt, định hướng tăng trưởng dài hạn." },
              ].map((b) => (
                <div key={b.lvl} className={`p-4 rounded-lg border ${b.color}`}>
                  <Badge variant="outline" className="mb-2">{b.lvl}</Badge>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
