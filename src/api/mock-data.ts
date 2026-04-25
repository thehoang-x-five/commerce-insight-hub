import type {
  Category, Product, Review, Order, User,
  KpiSummary, RevenuePoint, CategoryRevenue, ChannelRevenue, RegionRevenue, TopProductRow,
} from "@/types/domain";

export const categories: Category[] = [
  { id: "c1", slug: "dien-thoai", name: "Điện thoại", icon: "Smartphone" },
  { id: "c2", slug: "laptop", name: "Laptop", icon: "Laptop" },
  { id: "c3", slug: "tablet", name: "Tablet", icon: "Tablet" },
  { id: "c4", slug: "phu-kien", name: "Phụ kiện", icon: "Headphones" },
  { id: "c5", slug: "dong-ho", name: "Đồng hồ", icon: "Watch" },
  { id: "c6", slug: "tivi", name: "Tivi", icon: "Tv" },
  { id: "c7", slug: "may-anh", name: "Máy ảnh", icon: "Camera" },
  { id: "c8", slug: "gia-dung", name: "Gia dụng", icon: "Refrigerator" },
];

const img = (seed: string, w = 600, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const baseProducts: Omit<Product, "images" | "thumbnail">[] = [
  { id: "p1", slug: "iphone-15-pro-max", name: "iPhone 15 Pro Max 256GB", brand: "Apple", categoryId: "c1",
    price: 29990000, originalPrice: 34990000, discountPercent: 14,
    rating: 4.8, reviewCount: 1820, soldCount: 5430, stock: 42,
    shortDescription: "Chip A17 Pro, khung Titanium, camera 48MP",
    description: "iPhone 15 Pro Max — flagship 2024 với chip A17 Pro 3nm, khung Titanium siêu nhẹ, hệ thống camera 48MP và cổng USB-C tốc độ cao.",
    specs: { "Màn hình": "6.7\" Super Retina XDR", "Chip": "Apple A17 Pro", "RAM": "8GB", "Bộ nhớ": "256GB", "Pin": "4422 mAh" },
    tags: ["new", "hot"], isFeatured: true, isFlashSale: true },
  { id: "p2", slug: "samsung-s24-ultra", name: "Samsung Galaxy S24 Ultra 12GB/256GB", brand: "Samsung", categoryId: "c1",
    price: 26990000, originalPrice: 31990000, discountPercent: 16,
    rating: 4.7, reviewCount: 1320, soldCount: 4120, stock: 35,
    shortDescription: "Galaxy AI, bút S Pen, camera 200MP",
    description: "Samsung Galaxy S24 Ultra tích hợp Galaxy AI, camera 200MP, bút S Pen và màn hình Dynamic AMOLED 2X.",
    specs: { "Màn hình": "6.8\" Dynamic AMOLED 2X", "Chip": "Snapdragon 8 Gen 3", "RAM": "12GB", "Bộ nhớ": "256GB", "Pin": "5000 mAh" },
    tags: ["new"], isFeatured: true, isFlashSale: true },
  { id: "p3", slug: "xiaomi-14-pro", name: "Xiaomi 14 Pro 12GB/512GB", brand: "Xiaomi", categoryId: "c1",
    price: 18990000, originalPrice: 22990000, discountPercent: 17,
    rating: 4.6, reviewCount: 540, soldCount: 1820, stock: 28,
    shortDescription: "Leica camera, Snapdragon 8 Gen 3",
    description: "Xiaomi 14 Pro với hệ thống camera Leica chuyên nghiệp, chip Snapdragon 8 Gen 3 mạnh mẽ.",
    specs: { "Màn hình": "6.73\" LTPO", "Chip": "Snapdragon 8 Gen 3", "RAM": "12GB", "Bộ nhớ": "512GB" },
    tags: ["hot"], isFlashSale: true },
  { id: "p4", slug: "oppo-find-x7", name: "OPPO Find X7 Ultra", brand: "OPPO", categoryId: "c1",
    price: 19990000, originalPrice: 23990000, discountPercent: 16,
    rating: 4.5, reviewCount: 320, soldCount: 980, stock: 22,
    shortDescription: "Camera Hasselblad, sạc 100W",
    description: "OPPO Find X7 Ultra cộng tác Hasselblad, camera 4 ống kính tele.",
    specs: { "Màn hình": "6.82\" AMOLED", "Chip": "Snapdragon 8 Gen 3", "RAM": "16GB", "Bộ nhớ": "512GB" },
    tags: ["new"] },
  { id: "p5", slug: "macbook-pro-m3", name: "MacBook Pro 14 M3 16GB/512GB", brand: "Apple", categoryId: "c2",
    price: 41990000, originalPrice: 45990000, discountPercent: 9,
    rating: 4.9, reviewCount: 720, soldCount: 1240, stock: 18,
    shortDescription: "Chip M3, màn Liquid Retina XDR",
    description: "MacBook Pro 14 inch chip M3 — hiệu năng cực mạnh cho dân thiết kế và lập trình.",
    specs: { "Màn hình": "14.2\" Liquid Retina XDR", "Chip": "Apple M3", "RAM": "16GB", "SSD": "512GB" },
    tags: ["hot"], isFeatured: true },
  { id: "p6", slug: "asus-rog-strix", name: "ASUS ROG Strix G16 i7 RTX 4060", brand: "ASUS", categoryId: "c2",
    price: 32990000, originalPrice: 36990000, discountPercent: 11,
    rating: 4.6, reviewCount: 280, soldCount: 540, stock: 15,
    shortDescription: "Gaming i7-13650HX, RTX 4060 8GB",
    description: "Laptop gaming ASUS ROG Strix G16 hiệu năng cao cho game thủ.",
    specs: { "CPU": "Intel i7-13650HX", "RAM": "16GB DDR5", "VGA": "RTX 4060 8GB", "SSD": "512GB" },
    tags: ["gaming"] },
  { id: "p7", slug: "dell-xps-13", name: "Dell XPS 13 Plus i7", brand: "Dell", categoryId: "c2",
    price: 28990000, rating: 4.5, reviewCount: 180, soldCount: 320, stock: 12,
    shortDescription: "Ultrabook cao cấp, mỏng nhẹ",
    description: "Dell XPS 13 Plus — ultrabook cao cấp với thiết kế tối giản.",
    specs: { "CPU": "Intel i7-1360P", "RAM": "16GB", "SSD": "512GB" },
    tags: [] },
  { id: "p8", slug: "ipad-pro-m4", name: "iPad Pro 11 M4 256GB", brand: "Apple", categoryId: "c3",
    price: 25990000, originalPrice: 28990000, discountPercent: 10,
    rating: 4.8, reviewCount: 410, soldCount: 870, stock: 24,
    shortDescription: "Chip M4, màn OLED Tandem",
    description: "iPad Pro M4 với màn hình OLED Tandem cực sáng và chip M4.",
    specs: { "Màn hình": "11\" OLED", "Chip": "Apple M4", "Bộ nhớ": "256GB" },
    tags: ["new"], isFeatured: true },
  { id: "p9", slug: "samsung-tab-s9", name: "Samsung Galaxy Tab S9", brand: "Samsung", categoryId: "c3",
    price: 18990000, rating: 4.5, reviewCount: 220, soldCount: 510, stock: 30,
    shortDescription: "S Pen, AMOLED 11 inch",
    description: "Galaxy Tab S9 — máy tính bảng Android cao cấp.",
    specs: { "Màn hình": "11\" Dynamic AMOLED 2X", "Chip": "Snapdragon 8 Gen 2" },
    tags: [] },
  { id: "p10", slug: "airpods-pro-2", name: "AirPods Pro 2 USB-C", brand: "Apple", categoryId: "c4",
    price: 5490000, originalPrice: 6490000, discountPercent: 15,
    rating: 4.8, reviewCount: 2310, soldCount: 8210, stock: 120,
    shortDescription: "Chống ồn chủ động, USB-C",
    description: "AirPods Pro 2 phiên bản USB-C với chống ồn chủ động.",
    specs: { "Kết nối": "Bluetooth 5.3", "Pin": "6h (30h với case)" },
    tags: ["hot"], isFlashSale: true },
  { id: "p11", slug: "sony-wh1000xm5", name: "Sony WH-1000XM5", brand: "Sony", categoryId: "c4",
    price: 7990000, originalPrice: 9490000, discountPercent: 16,
    rating: 4.7, reviewCount: 980, soldCount: 2120, stock: 60,
    shortDescription: "Tai nghe chống ồn đỉnh cao",
    description: "Sony WH-1000XM5 — tai nghe chụp tai chống ồn hàng đầu.",
    specs: { "Pin": "30 giờ", "Kết nối": "Bluetooth 5.2" },
    tags: ["hot"], isFlashSale: true },
  { id: "p12", slug: "anker-sạc-nhanh", name: "Anker PowerCore 20000mAh", brand: "Anker", categoryId: "c4",
    price: 990000, rating: 4.6, reviewCount: 1520, soldCount: 6310, stock: 200,
    shortDescription: "Sạc dự phòng 20000mAh PD",
    description: "Pin sạc dự phòng Anker dung lượng cao, sạc nhanh PD.",
    specs: { "Dung lượng": "20000 mAh", "Cổng": "USB-C PD 30W" },
    tags: [] },
  { id: "p13", slug: "apple-watch-s9", name: "Apple Watch Series 9 GPS 45mm", brand: "Apple", categoryId: "c5",
    price: 9490000, originalPrice: 10990000, discountPercent: 13,
    rating: 4.7, reviewCount: 640, soldCount: 1430, stock: 40,
    shortDescription: "Double Tap, S9 chip",
    description: "Apple Watch Series 9 với cử chỉ Double Tap mới.",
    specs: { "Màn hình": "45mm Always-On Retina", "Chip": "Apple S9" },
    tags: ["new"] },
  { id: "p14", slug: "garmin-fenix-7", name: "Garmin Fenix 7", brand: "Garmin", categoryId: "c5",
    price: 17990000, rating: 4.8, reviewCount: 240, soldCount: 410, stock: 22,
    shortDescription: "Đồng hồ thể thao GPS đa môn",
    description: "Garmin Fenix 7 — đồng hồ thể thao chuyên nghiệp.",
    specs: { "Pin": "18 ngày", "GPS": "Multi-band" },
    tags: [] },
  { id: "p15", slug: "lg-oled-c3-55", name: "Tivi LG OLED C3 55 inch", brand: "LG", categoryId: "c6",
    price: 27990000, originalPrice: 32990000, discountPercent: 15,
    rating: 4.8, reviewCount: 320, soldCount: 540, stock: 14,
    shortDescription: "OLED 4K 120Hz, AI α9 Gen6",
    description: "Tivi LG OLED C3 55 inch hình ảnh OLED đỉnh cao.",
    specs: { "Kích thước": "55 inch", "Độ phân giải": "4K", "Tần số": "120Hz" },
    tags: ["hot"] },
  { id: "p16", slug: "samsung-qled-q80c", name: "Samsung QLED Q80C 65 inch", brand: "Samsung", categoryId: "c6",
    price: 29990000, rating: 4.6, reviewCount: 180, soldCount: 280, stock: 9,
    shortDescription: "QLED 4K Neural Processor",
    description: "Tivi Samsung QLED Q80C 65 inch.",
    specs: { "Kích thước": "65 inch", "Độ phân giải": "4K" },
    tags: [] },
  { id: "p17", slug: "canon-r6-mark-ii", name: "Canon EOS R6 Mark II", brand: "Canon", categoryId: "c7",
    price: 56990000, rating: 4.9, reviewCount: 120, soldCount: 180, stock: 8,
    shortDescription: "Full-frame mirrorless 24MP",
    description: "Máy ảnh không gương lật full-frame Canon R6 II.",
    specs: { "Cảm biến": "Full-frame 24.2MP", "Quay phim": "4K 60p" },
    tags: ["pro"] },
  { id: "p18", slug: "sony-a7-iv", name: "Sony Alpha A7 IV", brand: "Sony", categoryId: "c7",
    price: 59990000, rating: 4.9, reviewCount: 140, soldCount: 210, stock: 6,
    shortDescription: "Full-frame 33MP, lai video",
    description: "Sony A7 IV — máy ảnh full-frame hybrid mạnh mẽ.",
    specs: { "Cảm biến": "Full-frame 33MP", "Quay phim": "4K 60p" },
    tags: ["pro"] },
  { id: "p19", slug: "tu-lanh-samsung-inverter", name: "Tủ lạnh Samsung Inverter 380L", brand: "Samsung", categoryId: "c8",
    price: 12990000, originalPrice: 14990000, discountPercent: 13,
    rating: 4.6, reviewCount: 520, soldCount: 1230, stock: 35,
    shortDescription: "Inverter tiết kiệm điện, 380L",
    description: "Tủ lạnh Samsung 380L công nghệ Inverter.",
    specs: { "Dung tích": "380L", "Công nghệ": "Digital Inverter" },
    tags: [] },
  { id: "p20", slug: "may-giat-lg-inverter", name: "Máy giặt LG Inverter 9kg", brand: "LG", categoryId: "c8",
    price: 8990000, originalPrice: 10490000, discountPercent: 14,
    rating: 4.7, reviewCount: 410, soldCount: 1620, stock: 28,
    shortDescription: "AI DD, lồng ngang 9kg",
    description: "Máy giặt LG lồng ngang 9kg công nghệ AI DD.",
    specs: { "Khối lượng giặt": "9kg", "Công nghệ": "AI Direct Drive" },
    tags: [] },
];

export const products: Product[] = baseProducts.map((p) => ({
  ...p,
  thumbnail: img(p.slug),
  images: [img(p.slug), img(p.slug + "-2"), img(p.slug + "-3"), img(p.slug + "-4")],
}));

export const reviews: Review[] = products.flatMap((p) =>
  Array.from({ length: 3 }, (_, i) => ({
    id: `${p.id}-r${i + 1}`,
    productId: p.id,
    userId: `u${i + 1}`,
    userName: ["Nguyễn Văn A", "Trần Thị B", "Lê Minh C", "Phạm Quỳnh D"][i % 4],
    rating: 5 - (i % 2),
    comment: [
      "Sản phẩm tốt, giao hàng nhanh, đóng gói cẩn thận.",
      "Đúng mô tả, dùng êm. Sẽ ủng hộ shop tiếp.",
      "Chất lượng vượt mong đợi với mức giá này.",
    ][i],
    createdAt: new Date(Date.now() - (i + 1) * 86400000 * 7).toISOString(),
  })),
);

export const users: User[] = [
  { id: "u1", email: "demo@tgdd.vn", fullName: "Nguyễn Demo", phone: "0900000001", role: "customer" },
  { id: "u-admin", email: "admin@tgdd.vn", fullName: "Quản trị TGDĐ", role: "admin" },
];

const orderStatuses: Order["status"][] = ["pending", "confirmed", "shipping", "delivered", "delivered", "cancelled"];
const payments: Order["paymentMethod"][] = ["cod", "momo", "vnpay", "card"];

export const orders: Order[] = Array.from({ length: 18 }, (_, i) => {
  const productPick = products[i % products.length];
  const qty = (i % 3) + 1;
  const subtotal = productPick.price * qty;
  const shippingFee = subtotal > 5_000_000 ? 0 : 30_000;
  const discount = i % 4 === 0 ? 200_000 : 0;
  return {
    id: `o${i + 1}`,
    code: `DH${String(20240000 + i + 1)}`,
    userId: i % 5 === 0 ? "u1" : `u${(i % 9) + 2}`,
    customerName: ["Nguyễn Văn A","Trần Thị B","Lê Minh C","Phạm Quỳnh D","Hoàng Hữu E"][i % 5],
    customerPhone: `09${String(10000000 + i * 3217).slice(0,8)}`,
    shippingAddress: ["123 Lê Lợi, Q.1, TP.HCM","45 Cầu Giấy, Hà Nội","78 Hùng Vương, Đà Nẵng","12 Trần Phú, Cần Thơ"][i % 4],
    items: [{
      productId: productPick.id, productName: productPick.name,
      thumbnail: productPick.thumbnail, price: productPick.price, quantity: qty,
    }],
    subtotal, shippingFee, discount,
    total: subtotal + shippingFee - discount,
    paymentMethod: payments[i % payments.length],
    status: orderStatuses[i % orderStatuses.length],
    createdAt: new Date(Date.now() - i * 86400000 * 1.5).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
  };
});

// ============== BI Mock ==============
const seedRng = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export function generateRevenueSeries(days: number, seed = 42): RevenuePoint[] {
  const rng = seedRng(seed);
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const base = 800_000_000 + Math.sin(i / 4) * 120_000_000;
    const noise = (rng() - 0.5) * 200_000_000;
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const weekendBoost = isWeekend ? 1.18 : 1;
    const revenue = Math.max(200_000_000, Math.round((base + noise) * weekendBoost));
    const orders = Math.round(revenue / 8_500_000 + rng() * 20);
    const visitors = Math.round(orders / (0.025 + rng() * 0.01));
    return { date: d.toISOString().slice(0, 10), revenue, orders, visitors };
  });
}

export const kpiSummary: KpiSummary = {
  revenue: 24_580_000_000, revenueGrowth: 12.4,
  orders: 3120, ordersGrowth: 8.7,
  aov: 7_876_000, aovGrowth: 3.4,
  customers: 2380, customersGrowth: 15.2,
  conversionRate: 2.84, conversionGrowth: 0.42,
};

export const categoryRevenue: CategoryRevenue[] = [
  { category: "Điện thoại", revenue: 9_820_000_000, share: 39.9 },
  { category: "Laptop", revenue: 6_140_000_000, share: 25.0 },
  { category: "Tablet", revenue: 2_950_000_000, share: 12.0 },
  { category: "Phụ kiện", revenue: 1_840_000_000, share: 7.5 },
  { category: "Đồng hồ", revenue: 1_230_000_000, share: 5.0 },
  { category: "Tivi", revenue: 1_470_000_000, share: 6.0 },
  { category: "Gia dụng", revenue: 1_130_000_000, share: 4.6 },
];

export const channelRevenue: ChannelRevenue[] = [
  { channel: "Website", revenue: 9_220_000_000, orders: 1180 },
  { channel: "App", revenue: 8_140_000_000, orders: 1020 },
  { channel: "Marketplace", revenue: 4_520_000_000, orders: 620 },
  { channel: "Offline", revenue: 2_700_000_000, orders: 300 },
];

export const regionRevenue: RegionRevenue[] = [
  { region: "TP.HCM", revenue: 9_120_000_000, orders: 1180 },
  { region: "Hà Nội", revenue: 7_240_000_000, orders: 940 },
  { region: "Đà Nẵng", revenue: 2_310_000_000, orders: 320 },
  { region: "Cần Thơ", revenue: 1_840_000_000, orders: 240 },
  { region: "Hải Phòng", revenue: 1_530_000_000, orders: 200 },
  { region: "Khác", revenue: 2_540_000_000, orders: 240 },
];

export const topProducts: TopProductRow[] = products.slice(0, 10).map((p, i) => ({
  productId: p.id,
  name: p.name,
  category: categories.find((c) => c.id === p.categoryId)?.name || "—",
  unitsSold: Math.round(p.soldCount * (0.18 - i * 0.012)),
  revenue: Math.round(p.price * p.soldCount * (0.18 - i * 0.012)),
  growth: +(20 - i * 1.7 + (i % 2 ? -3 : 4)).toFixed(1),
}));
