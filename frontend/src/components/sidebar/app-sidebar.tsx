import { UserButton } from "./user-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "../ui/sidebar";
import { User, Activity } from "lucide-react";
import SidebarMenuItems from "./sidebar-menu-items";
import MobileSidebarClose from "./mobile-sidebar-close";
import Credits from "./credits";
import Upgrade from "./upgrade";
import { ThemeToggle } from "../ui/theme-toggle";
import { BrandLogo } from "../ui/brand-logo";

export default function AppSidebar() {
  const polarEnabled = process.env.NEXT_PUBLIC_POLAR_ENABLED === "true";

  return (
    <Sidebar className="border-r border-border/60 bg-sidebar/95 backdrop-blur-xl">
      <SidebarContent className="px-3">
        <MobileSidebarClose />
        <SidebarGroup>
          <SidebarGroupLabel className="mt-4 mb-5 flex items-center justify-between px-1">
            <BrandLogo href="/dashboard" size="md" />
            <ThemeToggle variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" />
          </SidebarGroupLabel>

          {/* Neural Engine Status Strip */}
          <div className="mx-1 mb-4 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-foreground">F5 Engine Online</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="audio-bar h-2 w-0.5 bg-primary rounded-full"></span>
              <span className="audio-bar h-3.5 w-0.5 bg-primary rounded-full"></span>
              <span className="audio-bar h-2.5 w-0.5 bg-primary rounded-full"></span>
            </div>
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 bg-card/20 p-3 space-y-2">
        <Credits />
        <div className="flex items-center justify-between gap-2">
          <Upgrade />
        </div>
        <UserButton
          className="border-border/60 hover:border-primary/50 w-full transition-colors"
          additionalLinks={
            polarEnabled
              ? [
                  {
                    label: "Customer Portal",
                    href: "/dashboard/customer-portal",
                    icon: <User className="h-4 w-4" />,
                  },
                ]
              : []
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
