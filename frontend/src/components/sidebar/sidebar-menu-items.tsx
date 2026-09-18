"use client";

import { LayoutDashboard, Wand2, FolderOpen, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import Link from "next/link";
import { cn } from "~/lib/utils";

export default function SidebarMenuItems() {
  const path = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      active: path === "/dashboard",
    },
    {
      title: "Create Studio",
      url: "/dashboard/create",
      icon: Wand2,
      active: path === "/dashboard/create",
    },
    {
      title: "Audio Projects",
      url: "/dashboard/projects",
      icon: FolderOpen,
      active: path === "/dashboard/projects",
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      active: path === "/dashboard/settings",
    },
  ];

  const handleMenuClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={item.active}
            className={cn(
              "group relative h-10 w-full justify-start rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
              item.active
                ? "bg-primary/15 text-primary font-bold shadow-xs border border-primary/25"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            )}
          >
            <Link
              href={item.url}
              onClick={handleMenuClick}
              className="flex cursor-pointer items-center gap-3 w-full"
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  item.active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="truncate">{item.title}</span>
              {item.active && (
                <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary shadow-xs shadow-primary" />
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}