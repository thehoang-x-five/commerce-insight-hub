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
import { Loader2, Mail, Lock, User as UserIcon, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SocialButton = ({
  provider,
  bg,
  fg,
  icon,
  onClick,
}: { provider: string; bg: string; fg: string; icon: React.ReactNode; onClick: () => void }) => (
  <Button
    type="button"
    variant="outline"
    onClick={onClick}
    className="w-full justify-center gap-2"
    style={{ background: bg, color: fg, borderColor: "transparent" }}
  >
    {icon} <span className="font-medium">{provider}</span>
  </Button>
);

export default function LoginPage() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [login, setLogin] = useState({ email: "demo@tgdd.vn", password: "demo1234" });
  const [reg, setReg] = useState({ email: "", password: "", fullName: "" });
  const [otpEmail, setOtpEmail] = useState("");

  const handlePwdLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await apiClient.login(login.email, login.password);
      setUser(u);
      toast.success(`Xin chào ${u.fullName}!`);
      navigate(u.role === "admin" ? "/admin" : "/");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await apiClient.register(reg);
      setUser(u);
      toast.success("Đăng ký thành công! Chào mừng bạn đến TGDĐ.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmail) return toast.error("Vui lòng nhập email");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`Đã gửi mã OTP đến ${otpEmail}`);
    setLoading(false);
    navigate(`/otp?email=${encodeURIComponent(otpEmail)}`);
  };

  const handleSocial = async (provider: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const u = await apiClient.login("demo@tgdd.vn", "social");
    setUser(u);
    toast.success(`Đăng nhập bằng ${provider} thành công`);
    navigate("/");
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] grid place-items-center py-10 px-4 bg-gradient-surface">
      <Card className="w-full max-w-md p-6 md:p-8 shadow-card-hover">
        <div className="text-center mb-6">
          <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-foreground font-display font-extrabold text-xl mb-3">T</div>
          <h1 className="font-display text-2xl font-bold">Chào mừng đến TGDĐ</h1>
          <p className="text-sm text-muted-foreground">Đăng nhập để mua sắm dễ dàng hơn</p>
        </div>

        <Tabs defaultValue="otp">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="otp">Email OTP</TabsTrigger>
            <TabsTrigger value="password">Mật khẩu</TabsTrigger>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
          </TabsList>

          {/* OTP via email */}
          <TabsContent value="otp" className="space-y-3 mt-4">
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <Label className="flex items-center gap-1.5 mb-1"><Mail className="h-3.5 w-3.5" /> Email</Label>
                <Input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Chúng tôi sẽ gửi mã OTP 6 số đến email này — không cần nhớ mật khẩu.
                </p>
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Gửi mã OTP
              </Button>
            </form>
          </TabsContent>

          {/* Password */}
          <TabsContent value="password" className="space-y-3 mt-4">
            <form onSubmit={handlePwdLogin} className="space-y-3">
              <div>
                <Label className="flex items-center gap-1.5 mb-1"><Mail className="h-3.5 w-3.5" /> Email</Label>
                <Input type="email" required value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Mật khẩu</Label>
                  <Link to="/forgot-password" className="text-xs text-secondary hover:underline">Quên mật khẩu?</Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPwd ? "text" : "password"}
                    required
                    value={login.password}
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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

          {/* Register */}
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
                <p className="text-xs text-muted-foreground mt-1">Tối thiểu 6 ký tự.</p>
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Đăng ký
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="my-5 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">hoặc</span>
          <Separator className="flex-1" />
        </div>

        <div className="space-y-2">
          <SocialButton
            provider="Tiếp tục với Google"
            bg="#fff"
            fg="#1f2937"
            onClick={() => handleSocial("Google")}
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            }
          />
          <SocialButton
            provider="Tiếp tục với Facebook"
            bg="#1877F2"
            fg="#fff"
            onClick={() => handleSocial("Facebook")}
            icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.022 10.125 11.927v-8.437H7.078v-3.49h3.047V9.412c0-3.017 1.792-4.682 4.533-4.682 1.312 0 2.686.235 2.686.235v2.965H15.83c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796v8.437C19.612 23.094 24 18.1 24 12.073z"/></svg>}
          />
          <SocialButton
            provider="Tiếp tục với Apple"
            bg="#000"
            fg="#fff"
            onClick={() => handleSocial("Apple")}
            icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>}
          />
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Bằng việc đăng nhập, bạn đồng ý với <Link to="#" className="text-secondary hover:underline">Điều khoản</Link> & <Link to="#" className="text-secondary hover:underline">Chính sách</Link>.
        </p>
      </Card>
    </div>
  );
}
