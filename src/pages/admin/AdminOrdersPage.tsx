import { useOrders, useUpdateOrderStatus } from "@/services/queries";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { formatVnd, formatDate } from "@/lib/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { toast } from "sonner";
import type { OrderStatus } from "@/types/domain";

const STATUS: { v: OrderStatus | "all"; label: string }[] = [
  { v: "all", label: "Tất cả" },
  { v: "pending", label: "Chờ xác nhận" },
  { v: "confirmed", label: "Đã xác nhận" },
  { v: "shipping", label: "Đang giao" },
  { v: "delivered", label: "Đã giao" },
  { v: "cancelled", label: "Đã hủy" },
];

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "border-warning/40 text-warning",
  confirmed: "border-info/40 text-info",
  shipping: "border-primary/40 text-primary",
  delivered: "border-success/40 text-success",
  cancelled: "border-destructive/40 text-destructive",
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const { data } = useOrders({ search, status });
  const update = useUpdateOrderStatus();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Quản lý đơn hàng</h1>
        <p className="text-sm text-muted-foreground">{data?.length || 0} đơn</p>
      </div>

      <Card className="p-4">
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Mã đơn, tên khách..." className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUS.map((s) => <SelectItem key={s.v} value={s.v}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b">
              <tr>
                <th className="text-left py-2 pl-2">Mã</th>
                <th className="text-left">Khách hàng</th>
                <th className="text-left">Ngày</th>
                <th className="text-right">SP</th>
                <th className="text-right">Tổng</th>
                <th className="text-left pl-3">Thanh toán</th>
                <th className="text-left pl-3 pr-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="py-2.5 pl-2 font-mono text-secondary font-semibold">{o.code}</td>
                  <td>
                    <p>{o.customerName}</p>
                    <p className="text-xs text-muted-foreground">{o.customerPhone}</p>
                  </td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td className="text-right">{o.items.length}</td>
                  <td className="text-right font-semibold">{formatVnd(o.total)}</td>
                  <td className="pl-3 uppercase text-xs">{o.paymentMethod}</td>
                  <td className="pl-3 pr-2">
                    <Select
                      value={o.status}
                      onValueChange={async (v) => {
                        await update.mutateAsync({ id: o.id, status: v as OrderStatus });
                        toast.success(`Cập nhật ${o.code}`);
                      }}
                    >
                      <SelectTrigger className={`h-8 text-xs ${STATUS_COLOR[o.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS.filter((s) => s.v !== "all").map((s) => (
                          <SelectItem key={s.v} value={s.v}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
