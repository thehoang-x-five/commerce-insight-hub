import { useAuthStore } from "@/store/auth-store";
import { useOrders } from "@/services/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { formatVnd, formatDate } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OrderStatus } from "@/types/domain";
import { Package, User, MapPin, Phone } from "lucide-react";

const STATUS_LABEL: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: "Chờ xác nhận", cls: "bg-warning/15 text-warning border-warning/30" },
  confirmed: { label: "Đã xác nhận", cls: "bg-info/15 text-info border-info/30" },
  shipping: { label: "Đang giao", cls: "bg-primary/15 text-primary border-primary/30" },
  delivered: { label: "Đã giao", cls: "bg-success/15 text-success border-success/30" },
  cancelled: { label: "Đã hủy", cls: "bg-destructive/15 text-destructive border-destructive/30" },
};

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const { data: orders } = useOrders({ userId: user?.id });
  if (!user) return <Navigate to="/login" replace />;

  const myOrders = orders ?? [];

  return (
    <div className="container py-6 md:py-10">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Tài khoản của tôi</h1>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Card className="p-5 h-fit space-y-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-brand text-foreground font-bold text-lg">
              {user.fullName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <div className="text-sm space-y-1.5 pt-3 border-t">
            <div className="flex items-center gap-2 text-muted-foreground"><User className="h-4 w-4" /> {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {user.phone || "—"}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Chưa cập nhật địa chỉ</div>
          </div>
          {user.role === "admin" && (
            <Button asChild variant="outline" className="w-full"><Link to="/admin">Vào trang quản trị</Link></Button>
          )}
        </Card>

        <div>
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Đơn hàng ({myOrders.length})</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá của tôi</TabsTrigger>
              <TabsTrigger value="address">Sổ địa chỉ</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-3 mt-4">
              {myOrders.length === 0 && (
                <Card className="p-10 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto opacity-30 mb-3" />
                  Bạn chưa có đơn hàng nào.
                </Card>
              )}
              {myOrders.map((o) => (
                <Card key={o.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-mono font-bold text-secondary">{o.code}</p>
                      <p className="text-xs text-muted-foreground">Đặt ngày {formatDate(o.createdAt)}</p>
                    </div>
                    <Badge variant="outline" className={STATUS_LABEL[o.status].cls}>{STATUS_LABEL[o.status].label}</Badge>
                  </div>
                  <div className="space-y-2">
                    {o.items.map((it) => (
                      <div key={it.productId} className="flex gap-3 text-sm">
                        <img src={it.thumbnail} alt="" className="h-14 w-14 rounded object-cover bg-muted" />
                        <div className="flex-1">
                          <p className="line-clamp-1">{it.productName}</p>
                          <p className="text-xs text-muted-foreground">{it.quantity} × {formatVnd(it.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tổng: <span className="font-bold text-secondary text-base">{formatVnd(o.total)}</span></span>
                    <Button size="sm" variant="outline">Chi tiết</Button>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <Card className="p-10 text-center text-muted-foreground">Chưa có đánh giá nào.</Card>
            </TabsContent>
            <TabsContent value="address" className="mt-4">
              <Card className="p-10 text-center text-muted-foreground">Chưa có địa chỉ nào.</Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
