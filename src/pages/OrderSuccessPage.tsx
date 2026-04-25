import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const code = params.get("code");
  return (
    <div className="container py-20 text-center max-w-lg">
      <div className="mx-auto h-20 w-20 grid place-items-center rounded-full bg-success/10 text-success mb-4 animate-scale-in">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      <h1 className="font-display text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
      <p className="text-muted-foreground mb-2">Cảm ơn bạn đã mua sắm tại Thế Giới Di Động.</p>
      {code && <p className="text-sm">Mã đơn hàng: <span className="font-mono font-bold text-secondary">{code}</span></p>}
      <div className="flex gap-3 justify-center mt-8">
        <Button asChild variant="outline"><Link to="/">Về trang chủ</Link></Button>
        <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"><Link to="/account/orders">Xem đơn hàng</Link></Button>
      </div>
    </div>
  );
}
