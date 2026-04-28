import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/api/client";
import { Mail, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function OtpPage() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = ["", "", "", "", "", ""];
    data.forEach((d, i) => (next[i] = d));
    setCode(next);
    inputs.current[Math.min(5, data.length)]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = code.join("");
    if (otp.length !== 6) return toast.error("Vui lòng nhập đủ 6 số");
    setLoading(true);
    try {
      // Mock: bất kỳ OTP 6 số nào cũng pass
      await new Promise((r) => setTimeout(r, 600));
      const u = await apiClient.login(email, "otp");
      setUser(u);
      toast.success("Xác thực thành công!");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const resend = () => {
    setSeconds(60);
    setCode(["", "", "", "", "", ""]);
    toast.success(`Đã gửi lại mã OTP đến ${email}`);
    inputs.current[0]?.focus();
  };

  return (
    <div className="min-h-[calc(100vh-200px)] grid place-items-center py-10 px-4 bg-gradient-surface">
      <Card className="w-full max-w-md p-6 md:p-8 shadow-card-hover">
        <div className="text-center mb-6">
          <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary mb-3">
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-bold">Xác thực Email</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Mã OTP 6 số đã được gửi đến<br />
            <strong className="text-foreground">{email || "email của bạn"}</strong>
          </p>
        </div>

        <form onSubmit={verify} className="space-y-4">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {code.map((c, i) => (
              <Input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                inputMode="numeric"
                maxLength={1}
                value={c}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                className="h-14 w-12 text-center text-xl font-display font-bold"
              />
            ))}
          </div>

          <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Xác nhận
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-4">
          {seconds > 0 ? (
            <>Gửi lại mã sau <strong className="text-foreground">{seconds}s</strong></>
          ) : (
            <Button variant="link" onClick={resend} className="text-secondary px-1">Gửi lại mã</Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-info/10 border border-info/30 rounded-md p-3 flex gap-2 mt-4">
          <ShieldCheck className="h-4 w-4 shrink-0 text-info" />
          <div>
            <strong>Demo:</strong> nhập bất kỳ 6 chữ số nào để mô phỏng xác thực thành công.
          </div>
        </div>

        <Button asChild variant="ghost" className="w-full mt-3">
          <Link to="/login"><ArrowLeft className="h-4 w-4 mr-1" /> Đổi phương thức đăng nhập</Link>
        </Button>
      </Card>
    </div>
  );
}
