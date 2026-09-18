import type { ReactNode } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "~/components/ui/brand-logo";
import { ThemeToggle } from "~/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground studio-grid-bg selection:bg-cyan-500/20 overflow-x-hidden">
      {/* Dynamic Ambient Blur Glows (Theme-aware) */}
      <div className="pointer-events-none fixed -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px]" />

      {/* Top Studio Header Bar */}
      <header className="relative z-20 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <BrandLogo href="/" size="md" />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border/70 bg-card/70 hover:bg-accent text-foreground transition-all shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Center Stage: Auth Workstation Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-auto">
        <div className="w-full max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Footer Bar */}
      <footer className="relative z-20 w-full border-t border-border/40 bg-background/60 backdrop-blur-xs py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>256-bit encrypted session • No payment info required for trial</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>20 Starter Credits Included</span>
            <span className="text-border">•</span>
            <span>48kHz Master Audio</span>
            <span className="text-border">•</span>
            <span>© 2026 VoxiCraft AI Voice Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}