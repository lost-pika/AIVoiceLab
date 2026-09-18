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
import { User, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import SidebarMenuItems from "./sidebar-menu-items";
import MobileSidebarClose from "./mobile-sidebar-close";
import Credits from "./credits";
import Upgrade from "./upgrade";
import { ThemeToggle } from "../ui/theme-toggle";

export default function AppSidebar() {
  const polarEnabled = process.env.NEXT_PUBLIC_POLAR_ENABLED === "true";

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar/95 backdrop-blur-xl">
      <SidebarContent className="px-3">
        <MobileSidebarClose />
        <SidebarGroup>
          <SidebarGroupLabel className="mt-5 mb-6 flex items-center justify-between px-2">
            <Link
              href="/dashboard"
              className="group flex cursor-pointer items-center gap-2.5"
              title="Go to Dashboard"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-cyan-500 text-white shadow-md shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
                <Wand2 className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-base font-black tracking-tight text-transparent leading-none">
                  AI Voice
                </span>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase mt-0.5">
                  Studio Pro
                </span>
              </div>
            </Link>

            <ThemeToggle variant="ghost" className="h-7 w-7" />
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 bg-card/30 p-3 space-y-2.5">
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
