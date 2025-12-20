"use client";
import { Home } from "lucide-react";
import { ComponentType, SVGProps } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import type { Tab } from "@/types/dashboard";

import {
  Store,
  Tags,
  List,
  BadgePercent,
  LayoutTemplate,
  Megaphone,
  Settings,
} from "lucide-react";
import Image from "next/image";

interface SidebarItem {
  title: string;
  tab: Tab;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const items: SidebarItem[] = [
  { title: "Stores", tab: "stores", icon: Store },
  { title: "Flyer Products", tab: "flyer-products", icon: Tags },
  { title: "Store Ads", tab: "store-ads", icon: Megaphone },
  { title: "Product Ads", tab: "product-ads", icon: BadgePercent },
  { title: "Product Banner", tab: "product-banner", icon: LayoutTemplate },
  { title: "Item List", tab: "item-list", icon: List },
  { title: "Settings", tab: "settings", icon: Settings },
];

interface AppSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { open } = useSidebar();
  const router = useRouter();
  return (
    <Sidebar
      className={`${
        open ? "w-48" : "w-14"
      } h-screen min-h-screen bg-[#0a1324] shadow-[0_4px_12px_rgba(0,0,0,0.7)] text-white transition-width duration-300`}
      variant="inset"
      collapsible="icon"
    >
      {/* ⭐ LOGO SECTION */}
      <SidebarHeader className="flex items-center justify-center py-4">
        {open ? (
          <Image
            src="/logo/logo.png"
            alt="Logo"
            width={128}
            height={40} 
            className="object-contain transition-all duration-300 rounded-full shadow-[0_0_10px_#ffffff]"
            priority
          />
        ) : (
          <Image
            src="/logo/logo.png"
            alt="Logo Icon"
            width={32}
            height={32}
            className="object-contain transition-all duration-300 rounded-full shadow-[0_0_10px_#ffffff]"
            priority
          />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = activeTab === item.tab;

                return (
                  <SidebarMenuItem key={item.tab}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.tab)}
                      className={`flex items-center cursor-pointer hover:bg-muted/50 ${
                        active ? "bg-muted text-primary text-lg transition-all duration-300 font-medium" : ""
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span className="ml-2">{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>

          {/* HOME BUTTON */}
          <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  {open && (
                    <span className="cursor-pointer text-white text-lg bg-blue-300 px-2 py-1 rounded-md hover:bg-blue-500">
                      Home
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
