import type { ReactNode } from "react";
import { Mic, Zap, ArrowLeft, ShieldCheck, Headphones } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "~/components/ui/brand-logo";
import { ThemeToggle } from "~/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left Side - Studio Branding & Showcase (Hidden on Mobile) */}
      <div className="relative hidden overflow-hidden bg-[#070b12] border-r border-border/50 lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 studio-grid-bg">
        {/* Subtle Ambient Studio Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Top Branding */}
        <div className="relative z-10">
          <BrandLogo href="/" size="lg" />
        </div>

        {/* Center Hero Message */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Studio-Grade Audio Synthesis</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl xl:text-5xl leading-tight">
            Craft authentic human speech with{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              neural voice cloning
            </span>
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Produce broadcast-quality voiceovers, podcasts, and storytelling in 23 global languages with expressive nuance and pacing.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {[
              {
                icon: Mic,
                title: "Zero-Shot Voice Cloning",
                desc: "Clone any voice from a 5-10s audio sample",
                color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
              },
              {
                icon: Zap,
                title: "Instant Audio Synthesis",
                desc: "High-speed cloud rendering in seconds",
                color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
              },
              {
                icon: Headphones,
                title: "48kHz Studio Master Output",
                desc: "Uncompressed broadcast-quality WAV exports",
                color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3.5 rounded-xl border border-border/40 bg-card/40 p-3 backdrop-blur-sm"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${item.color}`}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Social Proof & Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-border/50 pt-6">
          <div>
            <div className="text-xl font-bold text-foreground">20 Free</div>
            <div className="text-xs text-muted-foreground">Starter Credits</div>
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">23</div>
            <div className="text-xs text-muted-foreground">Global Languages</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400">48kHz</div>
            <div className="text-xs text-muted-foreground">Master Audio</div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form Viewport */}
      <div className="relative flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto bg-background/50">
        {/* Subtle Ambient Glows */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />

        {/* Top Utility Bar */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="lg:hidden">
            <BrandLogo href="/" size="sm" />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="relative z-10 my-auto w-full flex justify-center py-6">
          {children}
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 text-center text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            End-to-end encrypted session • All rights reserved
          </span>
        </div>
      </div>
    </div>
  );
}