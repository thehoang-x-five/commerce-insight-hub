// Domain types — shared by mock & real API
export type ID = string;

export interface Category {
  id: ID;
  slug: string;
  name: string;
  icon?: string;
}

export interface Product {
  id: ID;
  slug: string;
  name: string;
  brand: string;
  categoryId: ID;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  thumbnail: string;
  images: string[];
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
  tags: string[];
  isFeatured?: boolean;
  isFlashSale?: boolean;
}

export interface Review {
  id: ID;
  productId: ID;
  userId: ID;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: ID;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "admin";
}

export interface CartItem {
  productId: ID;
  quantity: number;
}

export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "momo" | "vnpay" | "card";

export interface OrderItem {
  productId: ID;
  productName: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: ID;
  code: string;
  userId: ID;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// BI types
export interface KpiSummary {
  revenue: number;
  revenueGrowth: number; // % vs prev period
  orders: number;
  ordersGrowth: number;
  aov: number; // average order value
  aovGrowth: number;
  customers: number;
  customersGrowth: number;
  conversionRate: number; // %
  conversionGrowth: number;
}

export interface RevenuePoint {
  date: string; // ISO yyyy-mm-dd
  revenue: number;
  orders: number;
  visitors: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  share: number; // %
}

export interface ChannelRevenue {
  channel: "Website" | "App" | "Marketplace" | "Offline";
  revenue: number;
  orders: number;
}

export interface RegionRevenue {
  region: string;
  revenue: number;
  orders: number;
}

export interface TopProductRow {
  productId: ID;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  growth: number;
}

export interface BiFilters {
  from: string;
  to: string;
  categoryId?: ID | "all";
  channel?: ChannelRevenue["channel"] | "all";
  region?: string | "all";
}
