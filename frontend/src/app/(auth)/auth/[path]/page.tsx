import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SignInForm } from "~/components/auth/sign-in-form";
import { SignUpForm } from "~/components/auth/sign-up-form";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ path: "sign-in" }, { path: "sign-up" }];
}

function AuthLoadingFallback() {
  return (
    <div className="flex h-72 w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
    </div>
  );
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  if (path !== "sign-in" && path !== "sign-up") {
    notFound();
  }

  return (
    <div className="relative rounded-3xl border border-border/80 bg-card/90 shadow-2xl backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
      {/* Left Spotlight: Studio Showcase & Live Audio Deck Preview (5 cols) */}
      <div className="relative bg-muted/40 border-b lg:border-b-0 lg:border-r border-border/60 p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between overflow-hidden">
        {/* Subtle Ambient Gradient */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>Neural Audio Studio</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
              Turn any text into studio-grade voiceovers.
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Instant voice cloning, natural emotional inflection, and uncompressed 48kHz audio in 23 global languages.
            </p>
          </div>

          {/* Interactive Soundwave Preview Card */}
          <div className="rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center font-extrabold text-xs text-slate-950 shadow-xs">
                  SJ
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Sarah Jenkins</div>
                  <div className="text-[11px] text-muted-foreground">Documentary & Narration</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                48kHz WAV
              </span>
            </div>

            {/* Equalizer Waveform */}
            <div className="flex items-end gap-1 h-8 px-1 py-0.5">
              {[35, 65, 45, 80, 60, 40, 75, 50, 65, 35, 55, 80, 45, 70, 40, 60].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-gradient-to-t from-cyan-500 to-emerald-400 opacity-85"
                  style={{
                    height: `${height}%`,
                    animation: `soundwave 1.2s ease-in-out infinite alternate ${i * 0.07}s`,
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1.5 border-t border-border/40">
              <span className="font-mono text-[10px]">0:14 / 0:48</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold text-[10px]">
                Cloned from 6s sample
              </span>
            </div>
          </div>
        </div>

        {/* Benefits & Social Proof */}
        <div className="relative z-10 pt-6 space-y-3 border-t border-border/50 mt-6">
          <div className="space-y-2">
            {[
              "20 Free Starter Credits on registration",
              "Zero-shot cloning from 5s audio clip",
              "Commercial rights & uncompressed WAV export",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-muted-foreground flex items-center justify-between">
            <span className="font-medium">⭐ 4.9/5 creator rating</span>
            <span className="font-medium">2,500+ active creators</span>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Auth Station (7 cols) */}
      <div className="p-6 sm:p-10 lg:p-12 lg:col-span-7 flex flex-col justify-center">
        {/* Segmented Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-muted/60 border border-border/60 mb-8 max-w-sm mx-auto w-full">
          <Link
            href="/auth/sign-in"
            className={cn(
              "text-center py-2 text-xs font-bold rounded-xl transition-all",
              path === "sign-in"
                ? "bg-card text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className={cn(
              "text-center py-2 text-xs font-bold rounded-xl transition-all",
              path === "sign-up"
                ? "bg-card text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Create Account
          </Link>
        </div>

        {/* Dynamic Form Content */}
        <Suspense fallback={<AuthLoadingFallback />}>
          {path === "sign-in" ? <SignInForm /> : <SignUpForm />}
        </Suspense>
      </div>
    </div>
  );
}
