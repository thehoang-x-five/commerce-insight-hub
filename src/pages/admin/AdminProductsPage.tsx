import { useProducts, useDeleteProduct, useUpdateProduct, useCreateProduct, useCategories } from "@/services/queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { useState } from "react";
import { formatVnd } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Product } from "@/types/domain";

const empty = {
  name: "", slug: "", brand: "", categoryId: "c1", price: 0, stock: 0,
  shortDescription: "", description: "", specs: {}, tags: [],
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const { data } = useProducts({ search, pageSize: 100 });
  const { data: cats } = useCategories();
  const del = useDeleteProduct();
  const upd = useUpdateProduct();
  const create = useCreateProduct();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<any>(empty);

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setOpen(true); };

  const submit = async () => {
    if (editing) {
      await upd.mutateAsync({ id: editing.id, patch: form });
      toast.success("Đã cập nhật sản phẩm");
    } else {
      await create.mutateAsync(form);
      toast.success("Đã tạo sản phẩm mới");
    }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-sm text-muted-foreground">{data?.total || 0} sản phẩm</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary-hover text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Thêm sản phẩm</Button>
      </div>

      <Card className="p-4">
        <div className="relative max-w-sm mb-4">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên, thương hiệu..." className="pl-9" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b">
              <tr>
                <th className="text-left py-2 pl-2">Sản phẩm</th>
                <th className="text-left">Thương hiệu</th>
                <th className="text-right">Giá</th>
                <th className="text-right">Tồn</th>
                <th className="text-right">Đã bán</th>
                <th className="text-right pr-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="py-2 pl-2">
                    <div className="flex items-center gap-2">
                      <img src={p.thumbnail} alt="" className="h-10 w-10 rounded-md object-cover" />
                      <div className="min-w-0">
                        <p className="font-medium line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{cats?.find(c => c.id === p.categoryId)?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td><Badge variant="outline">{p.brand}</Badge></td>
                  <td className="text-right text-secondary font-semibold">{formatVnd(p.price)}</td>
                  <td className="text-right">{p.stock}</td>
                  <td className="text-right">{p.soldCount.toLocaleString("vi-VN")}</td>
                  <td className="text-right pr-2">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={async () => {
                      await del.mutateAsync(p.id); toast.success("Đã xóa");
                    }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div><Label>Tên sản phẩm</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Thương hiệu</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
              <div>
                <Label>Danh mục</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{cats?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Giá (VND)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
              <div><Label>Tồn kho</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} /></div>
            </div>
            <div><Label>Mô tả ngắn</Label><Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></div>
            <div><Label>Mô tả</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
            <Button onClick={submit} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">{editing ? "Lưu" : "Tạo"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
