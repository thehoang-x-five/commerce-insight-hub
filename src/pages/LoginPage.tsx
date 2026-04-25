import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/api/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Lock, User as UserIcon, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState({ email: "demo@tgdd.vn", password: "demo1234" });
  const [reg, setReg] = useState({ email: "", password: "", fullName: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const u = await apiClient.login(login.email, login.password);
      setUser(u); toast.success(`Xin chào ${u.fullName}!`);
      navigate(u.role === "admin" ? "/admin" : "/");
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const u = await apiClient.register(reg);
      setUser(u); toast.success("Đăng ký thành công!"); navigate("/");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] grid place-items-center py-10 px-4 bg-gradient-surface">
      <Card className="w-full max-w-md p-6 md:p-8 shadow-card-hover">
        <div className="text-center mb-6">
          <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-foreground font-display font-extrabold text-xl mb-3">T</div>
          <h1 className="font-display text-2xl font-bold">Chào mừng đến TGDĐ</h1>
          <p className="text-sm text-muted-foreground">Đăng nhập để mua sắm dễ dàng hơn</p>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-3 mt-4">
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <Label className="flex items-center gap-1.5 mb-1"><Mail className="h-3.5 w-3.5" /> Email</Label>
                <Input type="email" required value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
              </div>
              <div>
                <Label className="flex items-center gap-1.5 mb-1"><Lock className="h-3.5 w-3.5" /> Mật khẩu</Label>
                <Input type="password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Đăng nhập
              </Button>
            </form>
            <div className="text-xs text-muted-foreground bg-muted rounded-md p-3 flex gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-info" />
              <div>
                <strong>Tài khoản demo:</strong><br />
                Khách: <code>demo@tgdd.vn</code> · Admin: <code>admin@tgdd.vn</code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-3 mt-4">
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <Label className="flex items-center gap-1.5 mb-1"><UserIcon className="h-3.5 w-3.5" /> Họ tên</Label>
                <Input required value={reg.fullName} onChange={(e) => setReg({ ...reg, fullName: e.target.value })} />
              </div>
              <div>
                <Label className="flex items-center gap-1.5 mb-1"><Mail className="h-3.5 w-3.5" /> Email</Label>
                <Input type="email" required value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} />
              </div>
              <div>
                <Label className="flex items-center gap-1.5 mb-1"><Lock className="h-3.5 w-3.5" /> Mật khẩu</Label>
                <Input type="password" required minLength={6} value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} />
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Đăng ký
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Bằng việc đăng nhập, bạn đồng ý với <Link to="#" className="text-secondary hover:underline">Điều khoản</Link>
        </p>
      </Card>
    </div>
  );
}
