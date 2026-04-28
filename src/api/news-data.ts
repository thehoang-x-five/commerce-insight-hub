// Mock news & promotions — easy to swap with real API later
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: "Đánh giá" | "Khuyến mãi" | "Thủ thuật" | "Tin công nghệ";
  author: string;
  publishedAt: string;
  readMinutes: number;
  body: string[];
  tags: string[];
}

export interface Promotion {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  badge: string;
  discountText: string;
  endsAt: string;
  conditions: string[];
  couponCode?: string;
}

const img = (s: string, w = 800, h = 500) =>
  `https://picsum.photos/seed/${encodeURIComponent(s)}/${w}/${h}`;

export const newsArticles: NewsArticle[] = [
  {
    id: "n1",
    slug: "danh-gia-iphone-15-pro-max",
    title: "Đánh giá chi tiết iPhone 15 Pro Max sau 1 tháng sử dụng",
    excerpt: "Khung Titanium nhẹ hơn, chip A17 Pro mạnh, camera 48MP cải tiến — liệu có đáng nâng cấp?",
    cover: img("news-iphone15"),
    category: "Đánh giá",
    author: "Minh Trí",
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    readMinutes: 6,
    tags: ["iPhone", "Apple", "Flagship"],
    body: [
      "iPhone 15 Pro Max là chiếc flagship đáng giá nhất 2024 mà Apple từng tung ra. Khung viền Titanium giúp máy nhẹ hơn 19g so với 14 Pro Max.",
      "Hiệu năng chip A17 Pro vượt trội với GPU 6 lõi hỗ trợ ray tracing, mở ra một kỷ nguyên gaming mới trên di động.",
      "Camera 48MP với ống tele 5x là điểm nhấn đáng giá nhất, cho khả năng zoom xa vượt trội.",
      "Tóm lại: nếu bạn đang dùng iPhone 13 Pro Max trở về trước, đây là thời điểm hợp lý để nâng cấp.",
    ],
  },
  {
    id: "n2",
    slug: "uu-dai-thang-4-tgdd",
    title: "Ưu đãi tháng 4 tại TGDĐ: giảm tới 5 triệu, trả góp 0%",
    excerpt: "Hàng loạt smartphone, laptop được giảm giá sốc kèm quà tặng giá trị tới 1 triệu đồng.",
    cover: img("promo-april"),
    category: "Khuyến mãi",
    author: "Thuỳ Dung",
    publishedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    readMinutes: 3,
    tags: ["Khuyến mãi", "Trả góp"],
    body: [
      "Trong tháng 4, TGDĐ áp dụng chương trình giảm giá lên đến 5 triệu đồng cho iPhone 15 series, Samsung S24 Ultra và MacBook M3.",
      "Khách hàng được hỗ trợ trả góp 0% qua thẻ tín dụng và Home Credit, kỳ hạn 6/9/12 tháng.",
      "Đặc biệt, hoá đơn từ 10 triệu được tặng voucher 500k cho lần mua tiếp theo.",
    ],
  },
  {
    id: "n3",
    slug: "meo-tang-toc-laptop",
    title: "5 mẹo giúp laptop chạy nhanh hơn 30% mà không cần nâng cấp",
    excerpt: "Giải phóng RAM, dọn dẹp khởi động, kiểm tra ổ đĩa... đơn giản nhưng cực kỳ hiệu quả.",
    cover: img("news-laptop-tips"),
    category: "Thủ thuật",
    author: "Hoàng Long",
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    readMinutes: 4,
    tags: ["Laptop", "Tips"],
    body: [
      "1. Tắt các ứng dụng khởi động cùng Windows trong Task Manager → Startup.",
      "2. Dùng tổ hợp Win + R → 'msconfig' để vô hiệu hoá các service không cần thiết.",
      "3. Kiểm tra ổ cứng bằng CrystalDiskInfo, nếu là HDD nên cân nhắc nâng cấp lên SSD.",
      "4. Cập nhật driver chipset và GPU mới nhất từ trang chủ nhà sản xuất.",
      "5. Vệ sinh keo tản nhiệt CPU sau 1-2 năm sử dụng để giảm nhiệt độ vận hành.",
    ],
  },
  {
    id: "n4",
    slug: "samsung-s24-ultra-vs-iphone-15-pro-max",
    title: "Samsung S24 Ultra vs iPhone 15 Pro Max: nên chọn flagship nào?",
    excerpt: "So sánh chi tiết camera, hiệu năng, pin và hệ sinh thái giữa hai siêu phẩm hàng đầu 2024.",
    cover: img("news-vs"),
    category: "Đánh giá",
    author: "Minh Trí",
    publishedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    readMinutes: 8,
    tags: ["Samsung", "Apple", "So sánh"],
    body: [
      "S24 Ultra thắng về zoom (100x) và bút S Pen, iPhone 15 Pro Max thắng về quay phim, ổn định và hệ sinh thái.",
      "Hiệu năng đa nhân: Snapdragon 8 Gen 3 nhỉnh hơn A17 Pro khoảng 8% trong các bài test thực tế.",
      "Pin S24 Ultra 5000 mAh vượt trội iPhone 15 Pro Max 4422 mAh trong tác vụ video streaming.",
    ],
  },
  {
    id: "n5",
    slug: "ai-tren-smartphone-2024",
    title: "AI trên smartphone 2024: cuộc đua chưa từng có",
    excerpt: "Galaxy AI, Apple Intelligence và Gemini Nano đang định nghĩa lại trải nghiệm di động.",
    cover: img("news-ai-phone"),
    category: "Tin công nghệ",
    author: "Thuỳ Dung",
    publishedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    readMinutes: 5,
    tags: ["AI", "Smartphone"],
    body: [
      "Galaxy AI của Samsung tích hợp dịch trực tiếp cuộc gọi, tóm tắt note và chỉnh ảnh chuyên sâu.",
      "Apple Intelligence ra mắt iOS 18 với Genmoji, Writing Tools và Siri thế hệ mới.",
      "Google Gemini Nano chạy hoàn toàn on-device, đảm bảo riêng tư và tốc độ phản hồi tức thời.",
    ],
  },
  {
    id: "n6",
    slug: "huong-dan-tra-gop-0-phan-tram",
    title: "Hướng dẫn mua trả góp 0% tại TGDĐ chi tiết từ A-Z",
    excerpt: "Điều kiện, thủ tục, các đối tác tài chính và lưu ý khi mua trả góp lãi suất 0%.",
    cover: img("news-installment"),
    category: "Thủ thuật",
    author: "Hoàng Long",
    publishedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    readMinutes: 5,
    tags: ["Trả góp", "Hướng dẫn"],
    body: [
      "Trả góp qua thẻ tín dụng: chỉ cần thẻ Visa/Master/JCB của 18 ngân hàng đối tác, hạn mức đủ giá trị máy.",
      "Trả góp qua Home Credit/HD Saison: cần CMND/CCCD + Bằng lái xe hoặc hộ khẩu, duyệt trong 15 phút.",
      "Lãi suất 0% áp dụng cho gói 6/9/12 tháng. Gói 24 tháng có lãi suất ưu đãi 1.99%/tháng.",
    ],
  },
];

export const promotions: Promotion[] = [
  {
    id: "pr1",
    slug: "sieu-sale-thang-4",
    title: "Siêu Sale Tháng 4 — Giảm tới 5 triệu",
    description: "Hàng loạt smartphone, laptop, tablet flagship được giảm giá sốc tới 5.000.000đ.",
    cover: img("promo-banner-april", 1200, 500),
    badge: "HOT",
    discountText: "Giảm tới 5.000.000đ",
    endsAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    conditions: [
      "Áp dụng cho iPhone 15 series, Samsung S24, MacBook M3",
      "Không cộng gộp với các chương trình khác",
      "Số lượng có hạn, áp dụng tới khi hết hàng",
    ],
    couponCode: "TGDD10",
  },
  {
    id: "pr2",
    slug: "tra-gop-0-phan-tram",
    title: "Trả góp 0% — Sở hữu ngay flagship",
    description: "Trả trước từ 0đ, kỳ hạn 6/9/12 tháng qua thẻ tín dụng hoặc Home Credit.",
    cover: img("promo-installment", 1200, 500),
    badge: "0%",
    discountText: "Lãi suất 0% — kỳ hạn 12 tháng",
    endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    conditions: [
      "Khách hàng có thẻ tín dụng các ngân hàng liên kết",
      "Hoặc CCCD + bằng lái xe để duyệt qua Home Credit",
      "Hoá đơn từ 3.000.000đ",
    ],
  },
  {
    id: "pr3",
    slug: "thu-cu-doi-moi",
    title: "Thu Cũ Đổi Mới — Giá tốt nhất hệ thống",
    description: "Định giá máy cũ minh bạch, trợ giá tới 3 triệu khi đổi sang flagship mới.",
    cover: img("promo-tradein", 1200, 500),
    badge: "TRADE-IN",
    discountText: "Trợ giá tới 3.000.000đ",
    endsAt: new Date(Date.now() + 86400000 * 45).toISOString(),
    conditions: [
      "Máy cũ còn hoạt động, không vô nước, không bể màn",
      "Áp dụng tại tất cả cửa hàng TGDĐ trên toàn quốc",
    ],
  },
  {
    id: "pr4",
    slug: "freeship-don-tu-500k",
    title: "Miễn phí vận chuyển toàn quốc",
    description: "Đơn hàng từ 500.000đ được miễn phí giao hàng tận nơi trong 24h nội thành.",
    cover: img("promo-freeship", 1200, 500),
    badge: "FREESHIP",
    discountText: "Free ship đơn từ 500k",
    endsAt: new Date(Date.now() + 86400000 * 60).toISOString(),
    conditions: ["Đơn hàng từ 500.000đ", "Áp dụng toàn quốc"],
    couponCode: "FREESHIP",
  },
];

export interface InstallmentPlan {
  months: 6 | 9 | 12 | 18 | 24;
  prepayPercent: 0 | 20 | 30 | 50;
  interestRate: number; // % per month
  partner: "Home Credit" | "HD Saison" | "Thẻ tín dụng" | "FE Credit";
}

export const installmentPlans: InstallmentPlan[] = [
  { months: 6, prepayPercent: 0, interestRate: 0, partner: "Thẻ tín dụng" },
  { months: 9, prepayPercent: 0, interestRate: 0, partner: "Thẻ tín dụng" },
  { months: 12, prepayPercent: 0, interestRate: 0, partner: "Thẻ tín dụng" },
  { months: 12, prepayPercent: 20, interestRate: 0, partner: "Home Credit" },
  { months: 18, prepayPercent: 30, interestRate: 1.49, partner: "Home Credit" },
  { months: 24, prepayPercent: 30, interestRate: 1.99, partner: "HD Saison" },
  { months: 24, prepayPercent: 50, interestRate: 1.49, partner: "FE Credit" },
];

export function calcMonthly(price: number, plan: InstallmentPlan): { monthly: number; total: number; prepay: number } {
  const prepay = (price * plan.prepayPercent) / 100;
  const principal = price - prepay;
  const total = principal * (1 + (plan.interestRate / 100) * plan.months);
  const monthly = Math.round(total / plan.months / 1000) * 1000;
  return { monthly, total: Math.round(total + prepay), prepay };
}

// Variants per product slug — only for hero/example products. Falls back to default for others.
export interface ProductVariants {
  colors: { name: string; hex: string }[];
  storages: { label: string; priceDelta: number }[];
}

export const productVariants: Record<string, ProductVariants> = {
  "iphone-15-pro-max": {
    colors: [
      { name: "Titan Đen", hex: "#3a3a3c" },
      { name: "Titan Trắng", hex: "#f5f5f0" },
      { name: "Titan Xanh", hex: "#3b5a7a" },
      { name: "Titan Tự Nhiên", hex: "#c0a98a" },
    ],
    storages: [
      { label: "256GB", priceDelta: 0 },
      { label: "512GB", priceDelta: 7_000_000 },
      { label: "1TB", priceDelta: 14_000_000 },
    ],
  },
  "samsung-s24-ultra": {
    colors: [
      { name: "Titan Xám", hex: "#4a4a4a" },
      { name: "Titan Tím", hex: "#9b8db5" },
      { name: "Titan Đen", hex: "#1a1a1a" },
      { name: "Titan Vàng", hex: "#d4b67e" },
    ],
    storages: [
      { label: "256GB", priceDelta: 0 },
      { label: "512GB", priceDelta: 4_000_000 },
      { label: "1TB", priceDelta: 9_000_000 },
    ],
  },
};

export const DEFAULT_VARIANTS: ProductVariants = {
  colors: [
    { name: "Đen", hex: "#1a1a1a" },
    { name: "Trắng", hex: "#f5f5f5" },
    { name: "Xanh", hex: "#3b7ad4" },
  ],
  storages: [{ label: "Mặc định", priceDelta: 0 }],
};

// Combos & accessories shown on PDP
export interface AccessoryItem {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
}

export const accessories: AccessoryItem[] = [
  { id: "acc1", name: "AirPods Pro 2 USB-C", price: 5_990_000, thumbnail: img("acc-airpods", 200, 200) },
  { id: "acc2", name: "Sạc nhanh 20W Apple", price: 590_000, thumbnail: img("acc-charger", 200, 200) },
  { id: "acc3", name: "Ốp lưng MagSafe", price: 1_290_000, thumbnail: img("acc-case", 200, 200) },
  { id: "acc4", name: "Cáp Lightning 1m", price: 490_000, thumbnail: img("acc-cable", 200, 200) },
  { id: "acc5", name: "Dán cường lực", price: 350_000, thumbnail: img("acc-glass", 200, 200) },
  { id: "acc6", name: "Tai nghe có dây EarPods", price: 690_000, thumbnail: img("acc-earpods", 200, 200) },
];

export interface ComboOffer {
  id: string;
  title: string;
  description: string;
  totalPrice: number;
  originalPrice: number;
  itemNames: string[];
}

export const combos: ComboOffer[] = [
  {
    id: "combo1",
    title: "Combo Cơ Bản",
    description: "Ốp lưng + Cáp sạc",
    totalPrice: 1_590_000,
    originalPrice: 1_990_000,
    itemNames: ["Ốp lưng MagSafe", "Cáp Lightning 1m"],
  },
  {
    id: "combo2",
    title: "Combo Nâng Cao",
    description: "AirPods Pro + Ốp lưng + Sạc nhanh",
    totalPrice: 7_290_000,
    originalPrice: 8_790_000,
    itemNames: ["AirPods Pro 2 USB-C", "Ốp lưng MagSafe", "Sạc nhanh 20W"],
  },
];

export interface ProtectionService {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: "shield" | "drop";
}

export const protectionServices: ProtectionService[] = [
  {
    id: "warranty1",
    name: "Bảo hành mở rộng 12 tháng",
    description: "Mở rộng bảo hành thêm 1 năm sau bảo hành chính hãng",
    price: 990_000,
    icon: "shield",
  },
  {
    id: "insurance1",
    name: "Bảo hiểm rơi vỡ 12 tháng",
    description: "Bảo hiểm 100% rơi vỡ, vô nước trong 12 tháng",
    price: 1_490_000,
    icon: "drop",
  },
];

export const exclusivePerks = [
  { title: "Giảm màn", value: "500.000đ", desc: "Thu cũ đổi mới" },
  { title: "Tặng voucher", value: "1.000.000đ", desc: "Mua phụ kiện" },
  { title: "Miễn phí", value: "100%", desc: "Giao hàng toàn quốc" },
];
