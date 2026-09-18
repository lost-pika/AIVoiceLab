import "~/styles/globals.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { type Metadata } from "next";
import BreadcrumbPageClient from "~/components/sidebar/breadcrumb-page-client";
import AppSidebar from "~/components/sidebar/app-sidebar";
import { DashboardHeaderActions } from "~/components/dashboard/dashboard-header-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Voice Studio | Studio Workstation",
  description: "AI Voice Studio - Transform text into natural speech with voice cloning",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col bg-background">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 sm:px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="hover:bg-accent/70 h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors" />
            <Separator
              orientation="vertical"
              className="h-4 bg-border/60"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPageClient />
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <DashboardHeaderActions />
        </header>
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background via-background to-muted/10 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
