import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target, TrendingUp, ShoppingBag, Brain, ArrowRight, Lightbulb,
  Building2, Globe, Smartphone, Cpu, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportPage() {
  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="bg-gradient-hero text-secondary-foreground py-12 md:py-16">
        <div className="container">
          <Badge className="bg-primary text-primary-foreground border-0 mb-4">Báo cáo cuối kỳ · HTTT QL</Badge>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            Hệ thống thông tin quản lý cho<br />
            <span className="text-primary">Thế Giới Di Động (TGDĐ)</span>
          </h1>
          <p className="mt-4 text-secondary-foreground/90 max-w-2xl">
            Doanh nghiệp B2C · Bán lẻ điện thoại, laptop, phụ kiện · Mô hình omni-channel (cửa hàng + website + app + marketplace).
            Trình bày kế hoạch kinh doanh, kiến trúc HTTT và báo cáo BI cho hệ thống.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button asChild size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold">
              <Link to="/bi">Xem BI Dashboard <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-secondary-foreground/40 text-secondary-foreground hover:bg-secondary-foreground/10">
              <Link to="/">Xem Website TGDĐ</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-10 space-y-10">
        <Tabs defaultValue="yc1">
          <TabsList className="grid grid-cols-2 max-w-xl">
            <TabsTrigger value="yc1">YC1: Doanh nghiệp & KHKD</TabsTrigger>
            <TabsTrigger value="yc3">YC3: Báo cáo BI</TabsTrigger>
          </TabsList>

          {/* YC1 — Business plan */}
          <TabsContent value="yc1" className="space-y-6 mt-6">
            <Card className="p-6">
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> 1a. Giới thiệu doanh nghiệp</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <p><strong>Tên:</strong> Thế Giới Di Động (TGDĐ)</p>
                  <p><strong>Ngành hàng:</strong> Bán lẻ thiết bị di động, laptop, phụ kiện công nghệ, đồng hồ, gia dụng.</p>
                  <p><strong>Mô hình:</strong> B2C — Omni-channel (cửa hàng vật lý + website + app + marketplace).</p>
                  <p><strong>Thị trường:</strong> 63 tỉnh thành Việt Nam, ~3.000 cửa hàng.</p>
                  <p><strong>Khách hàng mục tiêu:</strong> Cá nhân/hộ gia đình, độ tuổi 18–55, thu nhập trung bình–cao.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { Icon: Smartphone, label: "Điện thoại", v: "40% DT" },
                    { Icon: Cpu, label: "Laptop", v: "25% DT" },
                    { Icon: ShoppingBag, label: "Phụ kiện", v: "12% DT" },
                    { Icon: Globe, label: "Khác", v: "23% DT" },
                  ].map((s) => (
                    <Card key={s.label} className="p-4 bg-surface">
                      <s.Icon className="h-6 w-6 text-primary mb-2" />
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="font-display font-bold text-lg">{s.v}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> 1b. Sứ mệnh, Tầm nhìn & Mục tiêu</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "Sứ mệnh", desc: "Mang công nghệ tới mọi gia đình Việt Nam với giá hợp lý và trải nghiệm dịch vụ tốt nhất.", color: "border-primary/40 bg-primary/5" },
                  { title: "Tầm nhìn", desc: "Trở thành hệ thống bán lẻ công nghệ số 1 Đông Nam Á, chuyển đổi số toàn diện vào 2030.", color: "border-info/40 bg-info/5" },
                  { title: "Giá trị cốt lõi", desc: "Tận tâm với khách hàng · Trung thực · Sáng tạo · Hiệu quả · Hợp tác.", color: "border-success/40 bg-success/5" },
                ].map((b) => (
                  <Card key={b.title} className={`p-5 ${b.color}`}>
                    <h3 className="font-display font-bold mb-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </Card>
                ))}
              </div>
              <h3 className="font-display font-bold mt-6 mb-3">Mục tiêu SMART (2025)</h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  "Tăng trưởng doanh thu online 30% so với 2024",
                  "Đạt 5 triệu đơn hàng online/năm",
                  "Tỷ lệ chuyển đổi website ≥ 3.5%",
                  "Mở rộng 200 cửa hàng mới ở thị trường mới",
                  "NPS (Net Promoter Score) ≥ 65",
                  "Giảm chi phí vận hành/đơn 15%",
                ].map((g) => (
                  <li key={g} className="flex items-start gap-2 p-3 rounded-lg bg-surface">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> {g}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> 1c. Phân tích SWOT</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { t: "Strengths (Điểm mạnh)", color: "border-success/40 bg-success/5", items: ["Thương hiệu mạnh, độ phủ rộng", "Hệ thống logistic 63 tỉnh", "Đội ngũ sales chuyên nghiệp", "Vốn lớn — đàm phán với NCC"] },
                  { t: "Weaknesses (Điểm yếu)", color: "border-warning/40 bg-warning/5", items: ["Chi phí vận hành cao", "Phụ thuộc nhà cung cấp lớn", "App/website chưa cá nhân hóa sâu", "Margin thấp do cạnh tranh giá"] },
                  { t: "Opportunities (Cơ hội)", color: "border-info/40 bg-info/5", items: ["Thị trường e-commerce VN tăng 20%/năm", "Chuyển đổi số hộ gia đình", "Thanh toán không tiền mặt phát triển", "Thị trường ngách: gaming, smart home"] },
                  { t: "Threats (Thách thức)", color: "border-destructive/40 bg-destructive/5", items: ["Cạnh tranh từ Shopee/Lazada/Tiki", "Khan hiếm nguồn cung chip toàn cầu", "Người dùng nhạy cảm giá", "Quy định pháp lý e-commerce siết chặt"] },
                ].map((s) => (
                  <Card key={s.t} className={`p-4 ${s.color}`}>
                    <h3 className="font-display font-bold mb-3">{s.t}</h3>
                    <ul className="space-y-1.5 text-sm">
                      {s.items.map((i) => <li key={i} className="flex gap-2"><span className="text-muted-foreground">•</span> {i}</li>)}
                    </ul>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" /> 1d. Chiến lược & Sản phẩm số</h2>
              <p className="text-sm text-muted-foreground mb-4">Để hiện thực hóa kế hoạch kinh doanh, TGDĐ phát triển hệ thống TMĐT đầy đủ:</p>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { Icon: Smartphone, t: "Website & App TMĐT", d: "Mua sắm online, tìm kiếm, giỏ hàng, thanh toán đa dạng (COD, MoMo, VNPay, thẻ).", to: "/" },
                  { Icon: ShieldCheck, t: "Tài khoản khách hàng", d: "Quản lý đơn hàng, địa chỉ, đánh giá, sản phẩm yêu thích, lịch sử mua.", to: "/account" },
                  { Icon: ShoppingBag, t: "Hệ thống quản trị", d: "Admin CRUD sản phẩm, quản lý đơn hàng, theo dõi kho và doanh thu.", to: "/admin" },
                ].map((b) => (
                  <Link key={b.t} to={b.to}>
                    <Card className="p-5 hover:shadow-card-hover hover:border-primary/40 transition-base h-full">
                      <b.Icon className="h-8 w-8 text-primary mb-3" />
                      <h3 className="font-display font-bold mb-1">{b.t}</h3>
                      <p className="text-sm text-muted-foreground">{b.d}</p>
                      <p className="text-xs text-secondary font-medium mt-3 flex items-center gap-1">Xem demo <ArrowRight className="h-3 w-3" /></p>
                    </Card>
                  </Link>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* YC2 đã loại bỏ — chỉ làm báo cáo, không có UI */}


          {/* YC3 — BI */}
          <TabsContent value="yc3" className="space-y-6 mt-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h2 className="font-display text-2xl font-bold mb-3 flex items-center gap-2"><Brain className="h-5 w-5 text-secondary" /> Báo cáo BI: Revenue & Growth Dashboard</h2>
              <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
                Dashboard BI tổng hợp doanh thu, đơn hàng, tỷ lệ chuyển đổi và các chỉ số tăng trưởng — phục vụ điều hành ở cả 3 cấp:
                Operational (vận hành), Tactical (chiến thuật), và Strategic (chiến lược).
              </p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sale">
                <Link to="/bi">Mở BI Dashboard <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-2xl font-bold mb-4">Cấu trúc báo cáo BI</h2>
              <ul className="space-y-3 text-sm">
                {[
                  { t: "Bộ lọc (Filters)", d: "Date range (7/30/90 ngày), kênh bán (Website/App/Marketplace/Offline), khu vực địa lý." },
                  { t: "5 KPI chính", d: "Doanh thu, Số đơn hàng, AOV, Khách hàng mới, Conversion Rate — kèm % tăng trưởng vs kỳ trước." },
                  { t: "Biểu đồ phân tích", d: "Area chart doanh thu/đơn hàng theo ngày · Pie cơ cấu danh mục · Bar kênh bán · Bar khu vực · Line traffic." },
                  { t: "Bảng drill-down", d: "Top 10 sản phẩm bán chạy với SL, doanh thu, tăng trưởng — hỗ trợ quyết định nhập hàng/promotion." },
                  { t: "Decision matrix", d: "Phân loại từng thông tin theo cấp ra quyết định Operational/Tactical/Strategic." },
                ].map((b) => (
                  <li key={b.t} className="flex gap-3 p-3 rounded-lg bg-surface">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div><span className="font-semibold">{b.t}:</span> <span className="text-muted-foreground">{b.d}</span></div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-2xl font-bold mb-4">Mapping thông tin → Cấp ra quyết định</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface text-xs uppercase">
                    <tr>
                      <th className="text-left p-3">Thông tin trên Dashboard</th>
                      <th className="text-left p-3">Cấp</th>
                      <th className="text-left p-3">Quyết định hỗ trợ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Doanh thu/đơn hàng theo ngày", "Operational", "Theo dõi sức khoẻ kinh doanh hàng ngày, phát hiện bất thường."],
                      ["Top sản phẩm bán chạy", "Tactical", "Quyết định tăng/giảm nhập hàng, đặt promotion."],
                      ["Doanh thu theo kênh bán", "Tactical", "Phân bổ ngân sách marketing, đầu tư kênh tăng trưởng."],
                      ["Cơ cấu danh mục", "Strategic", "Định hướng mở rộng/thu hẹp danh mục dài hạn."],
                      ["Doanh thu theo khu vực", "Strategic", "Mở cửa hàng mới ở thị trường tiềm năng."],
                      ["Tỷ lệ chuyển đổi", "Tactical", "Tối ưu UX/UI website, thử nghiệm A/B."],
                      ["Khách hàng mới", "Strategic", "Hiệu quả branding & acquisition campaign."],
                    ].map((r, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="p-3 font-medium">{r[0]}</td>
                        <td className="p-3"><Badge variant="outline">{r[1]}</Badge></td>
                        <td className="p-3 text-muted-foreground">{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Local check icon (avoid extra import)
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
