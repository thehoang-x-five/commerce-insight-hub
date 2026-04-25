// TanStack Query hooks — server state layer
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, type ProductsQuery } from "@/api/client";
import type { BiFilters, Order, Product } from "@/types/domain";

export const qk = {
  categories: ["categories"] as const,
  products: (q?: ProductsQuery) => ["products", q ?? {}] as const,
  product: (slug: string) => ["product", slug] as const,
  reviews: (productId: string) => ["reviews", productId] as const,
  orders: (params?: object) => ["orders", params ?? {}] as const,
  bi: {
    kpi: (f: BiFilters) => ["bi", "kpi", f] as const,
    revenue: (f: BiFilters) => ["bi", "revenue", f] as const,
    category: (f: BiFilters) => ["bi", "category", f] as const,
    channel: (f: BiFilters) => ["bi", "channel", f] as const,
    region: (f: BiFilters) => ["bi", "region", f] as const,
    top: (f: BiFilters) => ["bi", "top", f] as const,
  },
};

export const useCategories = () =>
  useQuery({ queryKey: qk.categories, queryFn: () => apiClient.listCategories() });

export const useProducts = (q?: ProductsQuery) =>
  useQuery({ queryKey: qk.products(q), queryFn: () => apiClient.listProducts(q) });

export const useProduct = (slug: string) =>
  useQuery({ queryKey: qk.product(slug), queryFn: () => apiClient.getProduct(slug), enabled: !!slug });

export const useProductReviews = (productId: string) =>
  useQuery({ queryKey: qk.reviews(productId), queryFn: () => apiClient.getProductReviews(productId), enabled: !!productId });

export const useOrders = (params?: { userId?: string; status?: string; search?: string }) =>
  useQuery({ queryKey: qk.orders(params), queryFn: () => apiClient.listOrders(params) });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      apiClient.updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Product> }) =>
      apiClient.updateProduct(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

// BI hooks
export const useBiKpi = (f: BiFilters) =>
  useQuery({ queryKey: qk.bi.kpi(f), queryFn: () => apiClient.getKpiSummary(f) });
export const useBiRevenue = (f: BiFilters) =>
  useQuery({ queryKey: qk.bi.revenue(f), queryFn: () => apiClient.getRevenueSeries(f) });
export const useBiCategory = (f: BiFilters) =>
  useQuery({ queryKey: qk.bi.category(f), queryFn: () => apiClient.getCategoryRevenue(f) });
export const useBiChannel = (f: BiFilters) =>
  useQuery({ queryKey: qk.bi.channel(f), queryFn: () => apiClient.getChannelRevenue(f) });
export const useBiRegion = (f: BiFilters) =>
  useQuery({ queryKey: qk.bi.region(f), queryFn: () => apiClient.getRegionRevenue(f) });
export const useBiTopProducts = (f: BiFilters) =>
  useQuery({ queryKey: qk.bi.top(f), queryFn: () => apiClient.getTopProducts(f) });
