// app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import type { FC, ComponentType, SVGProps } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Store,
  Newspaper,
  List,
  Megaphone,
  Image,
  ShoppingBag,
  Settings,
} from "lucide-react";

// Import all sections
import StoreSection from "@/components/StoreSection";
import FlyerProducts from "@/components/FlyerProducts";
import ItemList from "@/components/ItemList";
import ProductAds from "@/components/ProductAds";
import ProductBanner from "@/components/ProductBanner";
import StoreAds from "@/components/StoreAds";
import Edit from "@/components/Edit";
import type { Tab } from "@/types/dashboard";
import { eventBus } from "@/utils/eventBus";
import DashboardPageWrapper from "@/components/DashboardPageWrapper";

// Map of tabs
const tabConfig: Record<
  Tab,
  { title: string; icon: ComponentType<SVGProps<SVGSVGElement>>; component: FC }
> = {
  stores: { title: "Stores", icon: Store, component: StoreSection },
  "flyer-products": {
    title: "Flyer Products",
    icon: Newspaper,
    component: FlyerProducts,
  },
  "item-list": { title: "Item List", icon: List, component: ItemList },
  "product-ads": {
    title: "Product Ads",
    icon: Megaphone,
    component: ProductAds,
  },
  "product-banner": {
    title: "Product Banner",
    icon: Image,
    component: ProductBanner,
  },
  "store-ads": { title: "Store Ads", icon: ShoppingBag, component: StoreAds },
  settings: { title: "Settings", icon: Settings, component: Edit },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("stores");

  const ActiveComponent = tabConfig[activeTab].component;
  const Icon = tabConfig[activeTab].icon;

  // Load saved default tab once on mount
  const handler = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("appSettings");
      if (!saved) return;

      const parsed = JSON.parse(saved);

      const defaultTab = parsed?.defaultTab as Tab | undefined;

      eventBus.on("switchTab", handler);

      if (defaultTab && tabConfig[defaultTab]) {
        setTimeout(() => {
          setActiveTab(defaultTab);
        }, 0);
      }
    } catch (err) {
      console.error("Failed to load default tab:", err);
    }

    return () => {
      eventBus.off("switchTab", handler);
    };
  }, [handler]);

  return (
      <DashboardPageWrapper>
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <SidebarInset>
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-6 container">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">
                {tabConfig[activeTab].title} Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Add and manage your {tabConfig[activeTab].title.toLowerCase()}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <ActiveComponent />
        </main>
      </SidebarInset>
    </SidebarProvider>
    </DashboardPageWrapper>
  );
}
