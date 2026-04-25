import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { LayoutDashboard, Package, ShoppingBag, BarChart3, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/admin", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/admin/products", icon: Package, label: "Sản phẩm" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Đơn hàng" },
  { to: "/bi", icon: BarChart3, label: "BI Dashboard" },
];

export function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  // Demo: bypass strict check — allow viewing admin even nếu chưa login (cho demo).
  // Nếu muốn strict: if (!user || user.role !== "admin") return <Navigate to="/login" />;

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-display font-extrabold">T</div>
            <div>
              <p className="font-display font-bold leading-tight">TGDĐ Admin</p>
              <p className="text-[10px] uppercase tracking-wider opacity-60">Control Panel</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-base ${
                  isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-brand" : "hover:bg-sidebar-accent"
                }`
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs hover:text-primary transition-base">
            <ArrowLeft className="h-3 w-3" /> Về website
          </Link>
          {user && (
            <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:opacity-80 w-full">
              <LogOut className="h-3 w-3" /> Đăng xuất
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 bg-card border-b flex items-center px-6 sticky top-0 z-30">
          <div className="text-sm text-muted-foreground">
            Xin chào, <span className="font-semibold text-foreground">{user?.fullName || "Admin"}</span>
          </div>
          <div className="ml-auto">
            <Button asChild variant="outline" size="sm"><Link to="/bi"><BarChart3 className="h-3.5 w-3.5 mr-1" /> BI</Link></Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
