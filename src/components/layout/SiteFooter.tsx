import { Link } from "react-router-dom";
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground font-display font-extrabold">
              T
            </div>
            <span className="font-display font-extrabold text-lg">Thế Giới Di Động</span>
          </div>
          <p className="text-sm text-background/70 leading-relaxed">
            Hệ thống bán lẻ điện thoại, laptop, phụ kiện chính hãng — uy tín hàng đầu Việt Nam.
          </p>
          <div className="flex gap-3 mt-4">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-base">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold mb-4">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li><Link to="#" className="hover:text-primary">Chính sách bảo hành</Link></li>
            <li><Link to="#" className="hover:text-primary">Chính sách đổi trả</Link></li>
            <li><Link to="#" className="hover:text-primary">Chính sách giao hàng</Link></li>
            <li><Link to="#" className="hover:text-primary">Trả góp 0%</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-4">Tài khoản</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li><Link to="/account" className="hover:text-primary">Tài khoản của tôi</Link></li>
            <li><Link to="/account/orders" className="hover:text-primary">Đơn hàng</Link></li>
            <li><Link to="/admin" className="hover:text-primary">Khu vực Admin</Link></li>
            <li><Link to="/bi" className="hover:text-primary">BI Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-4">Liên hệ</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> 128 Trần Quang Khải, Q.1, TP.HCM</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 1900.6868</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hi@tgdd.vn</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container py-4 text-xs text-background/60 flex flex-wrap gap-2 justify-between">
          <span>© 2025 Mockup TGDĐ — Báo cáo cuối kỳ HTTT QL.</span>
          <span>Mock data · Có cấu trúc dễ chuyển sang API thật.</span>
        </div>
      </div>
    </footer>
  );
}
