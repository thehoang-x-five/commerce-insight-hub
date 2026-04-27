import { useOrders, useUpdateOrderStatus } from "@/services/queries";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { formatVnd, formatDate } from "@/lib/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Printer, Package } from "lucide-react";
import { toast } from "sonner";
import type { Order, OrderStatus } from "@/types/domain";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

function exportOrdersCsv(orders: Order[]) {
  const rows = [
    ["Mã đơn", "Khách hàng", "SĐT", "Địa chỉ", "Tổng tiền", "Phương thức", "Trạng thái", "Ngày tạo"],
    ...orders.map((o) => [o.code, o.customerName, o.customerPhone, o.shippingAddress, String(o.total), o.paymentMethod, o.status, o.createdAt]),
  ];
  const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `orders-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const { data } = useOrders({ search, status });
  const update = useUpdateOrderStatus();
  const [detail, setDetail] = useState<Order | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-sm text-muted-foreground">{data?.length || 0} đơn</p>
        </div>
        <Button variant="outline" onClick={() => data && exportOrdersCsv(data)}>
          <Printer className="h-4 w-4 mr-1" /> Export CSV
        </Button>
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
                <th className="text-left pl-3">Trạng thái</th>
                <th className="text-right pr-2">Thao tác</th>
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
                  <td className="pl-3">
                    <Select
                      value={o.status}
                      onValueChange={async (v) => {
                        await update.mutateAsync({ id: o.id, status: v as OrderStatus });
                        toast.success(`Cập nhật ${o.code}`);
                      }}
                    >
                      <SelectTrigger className={`h-8 text-xs w-32 ${STATUS_COLOR[o.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS.filter((s) => s.v !== "all").map((s) => (
                          <SelectItem key={s.v} value={s.v}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="text-right pr-2">
                    <Button size="icon" variant="ghost" onClick={() => setDetail(o)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <OrderDetailDialog order={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function OrderDetailDialog({ order, onClose }: { order: Order | null; onClose: () => void }) {
  if (!order) return null;

  const printInvoice = () => window.print();

  return (
    <Dialog open={!!order} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-secondary" /> Chi tiết đơn hàng <span className="font-mono text-secondary">{order.code}</span>
          </DialogTitle>
        </DialogHeader>

        <div id="invoice-printable" className="space-y-4 text-sm">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-1">Khách hàng</p>
              <p className="font-semibold">{order.customerName}</p>
              <p className="text-muted-foreground">{order.customerPhone}</p>
              <p className="text-muted-foreground">{order.shippingAddress}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase text-muted-foreground mb-1">Đơn hàng</p>
              <p>Ngày: <strong>{formatDate(order.createdAt)}</strong></p>
              <p>Thanh toán: <strong className="uppercase">{order.paymentMethod}</strong></p>
              <p>Trạng thái: <Badge variant="outline" className="capitalize">{order.status}</Badge></p>
            </div>
          </div>

          <div className="border-t border-b py-3">
            <table className="w-full">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr><th className="text-left">Sản phẩm</th><th className="text-right">SL</th><th className="text-right">Đơn giá</th><th className="text-right">Thành tiền</th></tr>
              </thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.productId} className="border-t">
                    <td className="py-2">
                      <div className="flex gap-2">
                        <img src={it.thumbnail} alt="" className="h-10 w-10 rounded object-cover" />
                        <span className="line-clamp-2">{it.productName}</span>
                      </div>
                    </td>
                    <td className="text-right align-top pt-3">{it.quantity}</td>
                    <td className="text-right align-top pt-3">{formatVnd(it.price)}</td>
                    <td className="text-right align-top pt-3 font-semibold">{formatVnd(it.price * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1.5 text-right">
            <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatVnd(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Vận chuyển</span><span>{order.shippingFee === 0 ? "Miễn phí" : formatVnd(order.shippingFee)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-success"><span>Giảm giá</span><span>-{formatVnd(order.discount)}</span></div>}
            <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Tổng cộng</span><span className="text-secondary">{formatVnd(order.total)}</span></div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
          <Button onClick={printInvoice} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Printer className="h-4 w-4 mr-1" /> In hóa đơn
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
