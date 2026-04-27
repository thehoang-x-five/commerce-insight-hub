import { useAuthStore } from "@/store/auth-store";
import { useAddressStore } from "@/store/address-store";
import { useOrders } from "@/services/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Navigate } from "react-router-dom";
import { formatVnd, formatDate } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OrderStatus } from "@/types/domain";
import { Package, User, MapPin, Phone, Plus, Trash2, Star, Pencil, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const STATUS_LABEL: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: "Chờ xác nhận", cls: "bg-warning/15 text-warning border-warning/30" },
  confirmed: { label: "Đã xác nhận", cls: "bg-info/15 text-info border-info/30" },
  shipping: { label: "Đang giao", cls: "bg-primary/15 text-primary border-primary/30" },
  delivered: { label: "Đã giao", cls: "bg-success/15 text-success border-success/30" },
  cancelled: { label: "Đã hủy", cls: "bg-destructive/15 text-destructive border-destructive/30" },
};

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { data: orders } = useOrders({ userId: user?.id });
  const addresses = useAddressStore((s) => s.list);
  const addAddress = useAddressStore((s) => s.add);
  const removeAddress = useAddressStore((s) => s.remove);
  const setDefault = useAddressStore((s) => s.setDefault);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || "", phone: user?.phone || "" });
  const [addrOpen, setAddrOpen] = useState(false);
  const [addrForm, setAddrForm] = useState({ fullName: "", phone: "", address: "" });

  if (!user) return <Navigate to="/login" replace />;

  const myOrders = orders ?? [];

  const saveProfile = () => {
    setUser({ ...user, ...profileForm });
    setEditingProfile(false);
    toast.success("Đã cập nhật hồ sơ");
  };

  const saveAddress = () => {
    if (!addrForm.fullName || !addrForm.phone || !addrForm.address) {
      toast.error("Vui lòng điền đủ thông tin");
      return;
    }
    addAddress(addrForm);
    setAddrForm({ fullName: "", phone: "", address: "" });
    setAddrOpen(false);
    toast.success("Đã thêm địa chỉ");
  };

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
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {addresses.length} địa chỉ đã lưu</div>
          </div>
          {user.role === "admin" && (
            <Button asChild variant="outline" className="w-full"><Link to="/admin">Vào trang quản trị</Link></Button>
          )}
        </Card>

        <div>
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Đơn hàng ({myOrders.length})</TabsTrigger>
              <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
              <TabsTrigger value="address">Sổ địa chỉ ({addresses.length})</TabsTrigger>
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
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="profile" className="mt-4">
              <Card className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold">Thông tin cá nhân</h3>
                  {!editingProfile ? (
                    <Button size="sm" variant="outline" onClick={() => setEditingProfile(true)}><Pencil className="h-3 w-3 mr-1" /> Sửa</Button>
                  ) : (
                    <Button size="sm" onClick={saveProfile} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"><Save className="h-3 w-3 mr-1" /> Lưu</Button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <Label>Họ tên</Label>
                    <Input disabled={!editingProfile} value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input disabled value={user.email} />
                  </div>
                  <div>
                    <Label>Số điện thoại</Label>
                    <Input disabled={!editingProfile} value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Vai trò</Label>
                    <Input disabled value={user.role === "admin" ? "Quản trị viên" : "Khách hàng"} />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">{addresses.length} địa chỉ</p>
                <Button onClick={() => setAddrOpen(true)} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="h-4 w-4 mr-1" /> Thêm địa chỉ
                </Button>
              </div>

              {addresses.length === 0 ? (
                <Card className="p-10 text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto opacity-30 mb-3" />
                  Bạn chưa có địa chỉ nào.
                </Card>
              ) : (
                addresses.map((a) => (
                  <Card key={a.id} className="p-4 flex justify-between items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{a.fullName}</p>
                        <span className="text-muted-foreground text-sm">| {a.phone}</span>
                        {a.isDefault && <Badge variant="outline" className="border-success/40 text-success text-xs"><Star className="h-3 w-3 mr-0.5 fill-success" /> Mặc định</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{a.address}</p>
                    </div>
                    <div className="flex gap-1">
                      {!a.isDefault && (
                        <Button size="sm" variant="ghost" onClick={() => setDefault(a.id)}>Đặt mặc định</Button>
                      )}
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => { removeAddress(a.id); toast.success("Đã xóa"); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={addrOpen} onOpenChange={setAddrOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Thêm địa chỉ mới</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Họ tên người nhận</Label><Input value={addrForm.fullName} onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })} /></div>
            <div><Label>Số điện thoại</Label><Input value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} /></div>
            <div><Label>Địa chỉ chi tiết</Label><Input value={addrForm.address} onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddrOpen(false)}>Hủy</Button>
            <Button onClick={saveAddress} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">Lưu địa chỉ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
