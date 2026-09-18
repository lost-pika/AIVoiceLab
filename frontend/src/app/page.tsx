import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  Scissors,
  Expand,
  Target,
  Download,
  CheckCircle2,
  Play,
  Mic,
  ShieldCheck,
  Globe2,
  Waves,
  Cpu,
  Radio,
} from "lucide-react";
import Link from "next/link";
import DemoSection from "~/components/demo-section";
import { getCurrentSession } from "~/lib/session";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { BrandLogo } from "~/components/ui/brand-logo";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getCurrentSession();
  const isLoggedIn = !!session;

  const features = [
    {
      icon: <Scissors className="h-6 w-6" />,
      title: "Zero-Shot Voice Cloning",
      description:
        "Clone any voice with just a 5-10 second audio reference. Create custom voice actors instantly.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      icon: <Expand className="h-6 w-6" />,
      title: "Natural Neural Synthesis",
      description:
        "Convert text to speech with lifelike emotion, cadence, pause detection, and natural-sounding human warmth.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "23 Global Dialects",
      description:
        "Cross-lingual voice synthesis supporting English, Hindi, Spanish, French, Japanese, German, and more.",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "GPU Cloud Acceleration",
      description:
        "Cloud-accelerated inference powered by Modal and AWS S3 gives you studio-grade audio rendered in seconds.",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Voice Actor & Producer",
      content:
        "VoxiCraft Studio has revolutionized our audio workflows. What used to take hours of studio recording now takes seconds with unbelievable fidelity.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Podcast Host",
      content:
        "The voice clone fidelity is astounding. The pacing, breathing pauses, and intonation match natural speech without feeling robotic.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Content Creator",
      content:
        "I can translate and narrate my videos in Spanish, Hindi, and French while preserving authentic emotion. Absolute game changer!",
      rating: 5,
    },
  ];

  const pricingFeatures = [
    "Zero-shot Voice Cloning from Audio File",
    "Natural Speech Synthesis in 23 Languages",
    "Instant In-Card Voice Auditions",
    "Studio Master 48kHz WAV Exports",
    "Cloud Audio Storage & Media Vault",
    "Dedicated Cloud GPU Acceleration",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground studio-grid-bg">
      {/* Top Studio Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <BrandLogo href={isLoggedIn ? "/dashboard" : "/"} size="md" />

            <div className="hidden items-center space-x-8 md:flex">
              <a
                href="#features"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-cyan-400"
              >
                Features
              </a>
              <a
                href="#demo"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-cyan-400"
              >
                Auditions
              </a>
              <a
                href="#pricing"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-cyan-400"
              >
                Pricing
              </a>
              <a
                href="#reviews"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-cyan-400"
              >
                Reviews
              </a>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="gap-2 text-xs font-black rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-md shadow-cyan-500/20 hover:opacity-95"
                  >
                    <span>Open Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/sign-in">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs font-black rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-md shadow-cyan-500/20 hover:opacity-95"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_50%_15%,rgba(6,182,212,0.15),transparent_100%)] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Engine Pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold text-cyan-400">
              <Cpu className="h-3.5 w-3.5" />
              <span>Next-Gen F5-TTS Neural Workstation</span>
            </div>

            <h1 className="mb-6 text-4xl font-black tracking-tight text-foreground sm:text-6xl leading-[1.08]">
              Transform Any Script into{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Living Human Voice
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Professional zero-shot voice cloning and expressive multilingual speech synthesis. Produce broadcast-quality voiceovers, podcasts, and audiobooks in 23 languages within seconds.
            </p>

            <div className="flex flex-col gap-3.5 sm:flex-row sm:justify-center">
              <Link href={isLoggedIn ? "/dashboard/create" : "/auth/sign-up"}>
                <Button
                  size="lg"
                  className="h-12 w-full sm:w-auto px-8 gap-2 text-xs uppercase tracking-wider font-black rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-xl shadow-cyan-500/25 hover:opacity-95"
                >
                  <Mic className="h-4 w-4 fill-current" />
                  <span>Launch Studio Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href={isLoggedIn ? "/dashboard" : "/auth/sign-in"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full sm:w-auto px-6 gap-2 text-xs uppercase tracking-wider font-bold rounded-xl border-border/80 bg-background/60 hover:bg-muted"
                >
                  <Radio className="h-4 w-4 text-cyan-400" />
                  <span>{isLoggedIn ? "Open Command Center" : "Sign In to Studio"}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Social Proof Stats Matrix */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-cyan-400/40 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-cyan-400">23</div>
                <div className="text-xs text-muted-foreground mt-0.5 font-medium">Global Languages</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-emerald-400/40 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 5s</div>
                <div className="text-xs text-muted-foreground mt-0.5 font-medium">Cloning Audio Sample</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-purple-400/40 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-purple-400">48kHz</div>
                <div className="text-xs text-muted-foreground mt-0.5 font-medium">Master WAV Audio</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm hover:border-amber-400/40 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">4.9 ★</div>
                <div className="text-xs text-muted-foreground mt-0.5 font-medium">Studio Quality Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Audio Demos Showcase */}
      <div id="demo">
        <DemoSection />
      </div>

      {/* Features Grid */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Engineered for Professional{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Audio Precision
              </span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Everything you need to produce broadcast-ready voice media without expensive recording studios
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border/60 bg-card/60 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/5 rounded-2xl"
              >
                <CardContent className="p-6">
                  <div
                    className={`${feature.bgColor} mb-4 inline-flex items-center justify-center rounded-xl p-3 ${feature.color} border`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 sm:py-32 border-t border-border/60 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Loved by Audio Engineers & Creators
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              What voice professionals are saying about their VoxiCraft Studio experience
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-border/60 bg-card/60 backdrop-blur-sm p-6 flex flex-col justify-between rounded-2xl"
              >
                <div>
                  <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: Number(testimonial.rating) }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        />
                      ),
                    )}
                  </div>
                  <p className="mb-4 text-xs sm:text-sm leading-relaxed text-muted-foreground italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>
                <div className="border-t border-border/40 pt-3">
                  <div className="font-bold text-xs text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-32 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Simple Credit-Based Pricing
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Claim 10 free generations upon sign up. Top up anytime directly from your studio deck.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <Card className="relative overflow-hidden border-2 border-cyan-400/40 bg-card/80 backdrop-blur-md shadow-2xl rounded-3xl">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-400 to-emerald-400 px-3.5 py-1 text-[11px] font-black text-black rounded-bl-xl uppercase tracking-wider">
                Free Starter Account
              </div>
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold text-foreground">
                    Creator Studio
                  </h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-4xl font-black text-foreground">
                      $0
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground font-semibold">to begin</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Instant access to all 23 languages and custom voice cloning
                  </p>
                </div>

                <ul className="mb-8 space-y-3">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={isLoggedIn ? "/dashboard" : "/auth/sign-up"}>
                  <Button
                    className="w-full gap-2 text-xs uppercase tracking-wider font-black rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-lg shadow-cyan-500/25 hover:opacity-95"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{isLoggedIn ? "Open Command Center" : "Claim Free Account & 10 Credits"}</span>
                  </Button>
                </Link>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  No credit card required • Refill credits anytime from your studio deck
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <BrandLogo size="sm" />

            <p className="text-xs text-muted-foreground font-medium">
              &copy; {new Date().getFullYear()} VoxiCraft Studio. All rights reserved.
            </p>

            <div className="flex items-center space-x-6 text-xs text-muted-foreground font-medium">
              <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/create" className="hover:text-cyan-400 transition-colors">
                Voice Deck
              </Link>
              <Link href="/dashboard/projects" className="hover:text-cyan-400 transition-colors">
                Media Vault
              </Link>
              <Link href="/dashboard/settings" className="hover:text-cyan-400 transition-colors">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}