import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    toast.success(`Đã gửi email khôi phục đến ${email}`);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] grid place-items-center py-10 px-4 bg-gradient-surface">
      <Card className="w-full max-w-md p-6 md:p-8 shadow-card-hover">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-bold">Kiểm tra email của bạn</h1>
            <p className="text-sm text-muted-foreground">
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến<br />
              <strong className="text-foreground">{email}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Liên kết có hiệu lực trong 15 phút. Nếu không thấy email, hãy kiểm tra thư mục Spam.
            </p>
            <Button asChild className="w-full"><Link to="/login">Quay lại đăng nhập</Link></Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary mb-3">
                <Mail className="h-7 w-7" />
              </div>
              <h1 className="font-display text-2xl font-bold">Quên mật khẩu?</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div>
                <Label htmlFor="email" className="flex items-center gap-1.5 mb-1">
                  <Mail className="h-3.5 w-3.5" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Gửi liên kết khôi phục
              </Button>
            </form>

            <Button asChild variant="ghost" className="w-full mt-4">
              <Link to="/login"><ArrowLeft className="h-4 w-4 mr-1" /> Về trang đăng nhập</Link>
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
