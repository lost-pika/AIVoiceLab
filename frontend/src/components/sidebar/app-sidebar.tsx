import { UserButton } from "./user-button";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "../ui/sidebar";
import { User } from "lucide-react";
import SidebarMenuItems from "./sidebar-menu-items";
import MobileSidebarClose from "./mobile-sidebar-close";
import Credits from "./credits";
import { ThemeToggle } from "../ui/theme-toggle";
import { BrandLogo } from "../ui/brand-logo";

export default function AppSidebar() {
  const polarEnabled = process.env.NEXT_PUBLIC_POLAR_ENABLED === "true";

  return (
    <Sidebar className="border-r border-border/60 bg-sidebar/95 backdrop-blur-xl">
      <SidebarHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
        <BrandLogo href="/dashboard" size="md" />
        <ThemeToggle variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0" />
      </SidebarHeader>

      <SidebarContent className="px-3 pt-2">
        <MobileSidebarClose />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 bg-card/20 p-3 space-y-2">
        <Credits />
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
