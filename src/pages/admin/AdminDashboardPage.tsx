import { Card } from "@/components/ui/card";
import { useBiKpi, useBiRevenue, useBiCategory, useOrders } from "@/services/queries";
import { formatCompactVnd, formatNumber, formatPercent, formatVnd, formatDate } from "@/lib/format";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { TrendingUp, TrendingDown, ShoppingBag, Users, DollarSign, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

const today = new Date();
const filters = {
  from: new Date(today.getTime() - 29 * 86400000).toISOString().slice(0, 10),
  to: today.toISOString().slice(0, 10),
};

export default function AdminDashboardPage() {
  const { data: kpi } = useBiKpi(filters);
  const { data: series } = useBiRevenue(filters);
  const { data: cats } = useBiCategory(filters);
  const { data: orders } = useOrders();

  const cards = useMemo(() => kpi ? [
    { icon: DollarSign, label: "Doanh thu 30 ngày", value: formatCompactVnd(kpi.revenue), growth: kpi.revenueGrowth, color: "text-success" },
    { icon: ShoppingBag, label: "Đơn hàng", value: formatNumber(kpi.orders), growth: kpi.ordersGrowth, color: "text-info" },
    { icon: Package, label: "Giá trị TB / đơn", value: formatCompactVnd(kpi.aov), growth: kpi.aovGrowth, color: "text-primary" },
    { icon: Users, label: "Khách mới", value: formatNumber(kpi.customers), growth: kpi.customersGrowth, color: "text-secondary" },
  ] : [], [kpi]);

  const chartColors = ["hsl(var(--chart-1))","hsl(var(--chart-2))","hsl(var(--chart-3))","hsl(var(--chart-4))","hsl(var(--chart-5))","hsl(var(--chart-6))","hsl(var(--chart-1))"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Tổng quan doanh thu</h1>
        <p className="text-sm text-muted-foreground">30 ngày gần nhất · so với kỳ trước</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const up = c.growth >= 0;
          return (
            <Card key={c.label} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`grid h-9 w-9 place-items-center rounded-lg bg-muted ${c.color}`}><c.icon className="h-4 w-4" /></div>
                <Badge variant="outline" className={up ? "border-success/40 text-success" : "border-destructive/40 text-destructive"}>
                  {up ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {formatPercent(c.growth)}
                </Badge>
              </div>
              <p className="text-2xl font-display font-bold">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-display font-bold mb-4">Doanh thu theo ngày</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickFormatter={(v) => formatCompactVnd(v)} fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                formatter={(v: number) => formatVnd(v)} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-bold mb-4">Doanh thu theo danh mục</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cats} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tickFormatter={(v) => formatCompactVnd(v)} fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="category" fontSize={11} width={80} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatVnd(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {cats?.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-display font-bold mb-4">Đơn hàng gần đây</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b">
              <tr><th className="text-left py-2">Mã</th><th className="text-left">Khách hàng</th><th className="text-left">Ngày</th><th className="text-right">Tổng</th><th className="text-left pl-3">Trạng thái</th></tr>
            </thead>
            <tbody>
              {orders?.slice(0, 8).map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="py-2.5 font-mono text-secondary">{o.code}</td>
                  <td>{o.customerName}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td className="text-right font-semibold">{formatVnd(o.total)}</td>
                  <td className="pl-3"><Badge variant="outline" className="capitalize">{o.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
