// API client interface — swap implementation here when real backend is ready.
// Just replace `apiClient` export with a fetch-based version that hits real endpoints.
import {
  categories as mockCategories, products as mockProducts, reviews as mockReviews,
  orders as mockOrders, users as mockUsers,
  kpiSummary, categoryRevenue, channelRevenue, regionRevenue, topProducts,
  generateRevenueSeries,
} from "./mock-data";
import type {
  Category, Product, Review, Order, User, OrderItem, CartItem,
  KpiSummary, RevenuePoint, CategoryRevenue, ChannelRevenue, RegionRevenue, TopProductRow, BiFilters,
} from "@/types/domain";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export interface ProductsQuery {
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "popular" | "newest" | "price-asc" | "price-desc" | "rating";
  page?: number;
  pageSize?: number;
}

export interface ApiClient {
  // Catalog
  listCategories(): Promise<Category[]>;
  listProducts(q?: ProductsQuery): Promise<{ items: Product[]; total: number }>;
  getProduct(slug: string): Promise<Product | undefined>;
  getProductReviews(productId: string): Promise<Review[]>;

  // Auth (mock)
  login(email: string, password: string): Promise<User>;
  register(payload: { email: string; password: string; fullName: string }): Promise<User>;

  // Orders
  listOrders(params?: { userId?: string; status?: string; search?: string }): Promise<Order[]>;
  createOrder(payload: {
    userId: string; customerName: string; customerPhone: string; shippingAddress: string;
    items: OrderItem[]; paymentMethod: Order["paymentMethod"];
  }): Promise<Order>;
  updateOrderStatus(id: string, status: Order["status"]): Promise<Order>;

  // Admin product CRUD
  createProduct(p: Omit<Product, "id" | "rating" | "reviewCount" | "soldCount" | "images" | "thumbnail">): Promise<Product>;
  updateProduct(id: string, patch: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // BI
  getKpiSummary(filters: BiFilters): Promise<KpiSummary>;
  getRevenueSeries(filters: BiFilters): Promise<RevenuePoint[]>;
  getCategoryRevenue(filters: BiFilters): Promise<CategoryRevenue[]>;
  getChannelRevenue(filters: BiFilters): Promise<ChannelRevenue[]>;
  getRegionRevenue(filters: BiFilters): Promise<RegionRevenue[]>;
  getTopProducts(filters: BiFilters): Promise<TopProductRow[]>;
}

// In-memory mutable state for mock CRUD
const state = {
  products: [...mockProducts],
  orders: [...mockOrders],
};

const mockApi: ApiClient = {
  async listCategories() { await delay(150); return mockCategories; },

  async listProducts(q = {}) {
    await delay(200);
    let items = [...state.products];
    if (q.search) {
      const s = q.search.toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s));
    }
    if (q.categoryId && q.categoryId !== "all") items = items.filter((p) => p.categoryId === q.categoryId);
    if (q.brand && q.brand !== "all") items = items.filter((p) => p.brand === q.brand);
    if (typeof q.minPrice === "number") items = items.filter((p) => p.price >= q.minPrice!);
    if (typeof q.maxPrice === "number") items = items.filter((p) => p.price <= q.maxPrice!);
    switch (q.sort) {
      case "price-asc": items.sort((a, b) => a.price - b.price); break;
      case "price-desc": items.sort((a, b) => b.price - a.price); break;
      case "rating": items.sort((a, b) => b.rating - a.rating); break;
      case "newest": items.sort((a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0)); break;
      default: items.sort((a, b) => b.soldCount - a.soldCount);
    }
    const total = items.length;
    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 12;
    items = items.slice((page - 1) * pageSize, page * pageSize);
    return { items, total };
  },

  async getProduct(slug) { await delay(150); return state.products.find((p) => p.slug === slug); },
  async getProductReviews(productId) { await delay(120); return mockReviews.filter((r) => r.productId === productId); },

  async login(email) {
    await delay(400);
    const user = mockUsers.find((u) => u.email === email) ?? mockUsers[0];
    return user;
  },
  async register({ email, fullName }) {
    await delay(400);
    return { id: `u${Date.now()}`, email, fullName, role: "customer" };
  },

  async listOrders(params = {}) {
    await delay(180);
    let list = [...state.orders];
    if (params.userId) list = list.filter((o) => o.userId === params.userId);
    if (params.status && params.status !== "all") list = list.filter((o) => o.status === params.status);
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter((o) => o.code.toLowerCase().includes(s) || o.customerName.toLowerCase().includes(s));
    }
    return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
  async createOrder(payload) {
    await delay(500);
    const subtotal = payload.items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shippingFee = subtotal > 5_000_000 ? 0 : 30_000;
    const order: Order = {
      id: `o${Date.now()}`,
      code: `DH${Date.now().toString().slice(-8)}`,
      ...payload,
      subtotal, shippingFee, discount: 0,
      total: subtotal + shippingFee,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.orders.unshift(order);
    return order;
  },
  async updateOrderStatus(id, status) {
    await delay(200);
    const o = state.orders.find((x) => x.id === id);
    if (!o) throw new Error("Order not found");
    o.status = status;
    o.updatedAt = new Date().toISOString();
    return o;
  },

  async createProduct(p) {
    await delay(250);
    const slug = p.slug || p.name.toLowerCase().replace(/\s+/g, "-");
    const np: Product = {
      id: `p${Date.now()}`, slug,
      ...p,
      rating: 0, reviewCount: 0, soldCount: 0,
      thumbnail: `https://picsum.photos/seed/${slug}/600/600`,
      images: [`https://picsum.photos/seed/${slug}/600/600`],
    };
    state.products.unshift(np);
    return np;
  },
  async updateProduct(id, patch) {
    await delay(200);
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error("Product not found");
    state.products[idx] = { ...state.products[idx], ...patch };
    return state.products[idx];
  },
  async deleteProduct(id) {
    await delay(200);
    state.products = state.products.filter((p) => p.id !== id);
  },

  // BI — filters currently affect series length, kept simple for mock
  async getKpiSummary() { await delay(180); return kpiSummary; },
  async getRevenueSeries(filters) {
    await delay(220);
    const days = Math.max(7, Math.min(120, Math.round((+new Date(filters.to) - +new Date(filters.from)) / 86400000) + 1));
    return generateRevenueSeries(days, days * 7);
  },
  async getCategoryRevenue() { await delay(140); return categoryRevenue; },
  async getChannelRevenue() { await delay(140); return channelRevenue; },
  async getRegionRevenue() { await delay(140); return regionRevenue; },
  async getTopProducts() { await delay(160); return topProducts; },
};

// 👉 Swap point: when real API is ready, instantiate a real client matching ApiClient interface
// and export it here without touching service hooks or UI.
export const apiClient: ApiClient = mockApi;
