import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CompareBar } from "@/components/shop/CompareBar";
import { MobileBottomNav } from "./MobileBottomNav";

export function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <CartDrawer />
      <CompareBar />
      <MobileBottomNav />
    </div>
  );
}
