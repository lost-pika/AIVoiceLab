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
} from "lucide-react";
import Link from "next/link";
import DemoSection from "~/components/demo-section";
import { getCurrentSession } from "~/lib/session";
import { ThemeToggle } from "~/components/ui/theme-toggle";

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
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: <Expand className="h-6 w-6" />,
      title: "Natural Neural Synthesis",
      description:
        "Convert text to speech with lifelike emotion, cadence, pause detection, and natural-sounding human warmth.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "23 Global Languages",
      description:
        "Cross-lingual voice synthesis supporting English, Hindi, Spanish, French, Japanese, German, and more.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "GPU Cloud Acceleration",
      description:
        "Cloud-accelerated inference powered by Modal and AWS S3 gives you studio-grade audio rendered in seconds.",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Voice Actor & Producer",
      content:
        "AI Voice Studio has revolutionized our audio workflows. What used to take hours of studio recording now takes minutes.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Podcast Host",
      content:
        "The voice clone fidelity is astounding. The pacing and intonation match my voice naturally without feeling robotic.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Content Creator",
      content:
        "I can translate and narrate my videos in Spanish, Hindi, and French while preserving my own vocal identity. Game changer!",
      rating: 5,
    },
  ];

  const pricingFeatures = [
    "Zero-shot Voice Cloning from Audio File",
    "Natural Speech Synthesis in 23 Languages",
    "Instant Voice Audition & Previews",
    "High-Fidelity Uncompressed WAV Exports",
    "Cloud Audio Storage & Project History",
    "Fast GPU Cloud Infrastructure",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-purple-500 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-foreground">
                  AI Voice Studio
                </span>
                <span className="text-[10px] text-muted-foreground font-medium -mt-1">
                  Neural Audio Lab
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="hidden items-center space-x-8 md:flex">
              <a
                href="#features"
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Reviews
              </a>
            </div>

            {/* Auth CTA & Theme Toggle */}
            <div className="flex items-center gap-2.5">
              <ThemeToggle />

              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button size="sm" className="gap-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                    <span>Studio Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/sign-in">
                    <Button variant="ghost" size="sm" className="text-xs font-semibold">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button size="sm" className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_20%,var(--color-primary)/15,transparent_100%)] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>State-of-the-Art F5-TTS Neural Architecture</span>
            </div>

            <h1 className="mb-6 text-4xl font-black tracking-tight text-foreground sm:text-6xl leading-[1.1]">
              Transform Any Script into{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Lifelike Human Voice
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              Professional voice cloning and multi-lingual speech synthesis. Create authentic podcasts, video voiceovers, and dynamic audiobooks in 23 languages within seconds.
            </p>

            <div className="flex flex-col gap-3.5 sm:flex-row sm:justify-center">
              <Link href={isLoggedIn ? "/dashboard/create" : "/auth/sign-up"}>
                <Button
                  size="lg"
                  className="h-12 w-full sm:w-auto px-8 gap-2 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20"
                >
                  <Mic className="h-4 w-4" />
                  <span>Start Creating Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href={isLoggedIn ? "/dashboard" : "/auth/sign-in"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full sm:w-auto px-6 gap-2 text-sm font-semibold border-border/80 bg-background/60 hover:bg-muted"
                >
                  <Play className="h-4 w-4 fill-current text-primary" />
                  <span>{isLoggedIn ? "Open Dashboard" : "Sign In to Studio"}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 text-center">
            <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Powering modern creators and audio engineers worldwide
            </p>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 max-w-4xl mx-auto">
              <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-foreground">23</div>
                <div className="text-xs text-muted-foreground mt-0.5">Global Languages</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-foreground">&lt; 5s</div>
                <div className="text-xs text-muted-foreground mt-0.5">Voice Cloning Reference</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-foreground">100%</div>
                <div className="text-xs text-muted-foreground mt-0.5">S3 Cloud Audio Storage</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-amber-500">4.9 ★</div>
                <div className="text-xs text-muted-foreground mt-0.5">Studio Audio Quality</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Audio Demos */}
      <DemoSection />

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Engineered for Professional{" "}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Audio Precision
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Everything you need to produce broadcast-ready voice media without recording studios
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div
                    className={`${feature.bgColor} mb-4 inline-flex items-center justify-center rounded-xl p-3 ${feature.color}`}
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

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-32 border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Loved by Creators & Teams
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              What creative professionals are saying about their AI Voice Studio experience
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-border/60 bg-card/50 backdrop-blur-sm p-6 flex flex-col justify-between"
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
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Simple Credit-Based Pricing
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Sign up today and get 10 free generations instantly. Top up credits whenever you need.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <Card className="relative overflow-hidden border-2 border-primary/40 bg-card/70 backdrop-blur-md shadow-xl">
              <div className="absolute top-0 right-0 bg-primary px-3.5 py-1 text-[11px] font-bold text-primary-foreground rounded-bl-lg">
                Included with Free Account
              </div>
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold text-foreground">
                    Creator Starter
                  </h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-4xl font-black text-foreground">
                      $0
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground font-semibold">to get started</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Full access to all 23 languages and voice cloning
                  </p>
                </div>

                <ul className="mb-8 space-y-3">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2.5 text-xs text-foreground">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={isLoggedIn ? "/dashboard" : "/auth/sign-up"}>
                  <Button
                    className="w-full gap-2 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{isLoggedIn ? "Open Dashboard" : "Claim Free Account & 10 Credits"}</span>
                  </Button>
                </Link>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  No credit card required • Top-up anytime from your dashboard
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
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-foreground">
                AI Voice Studio
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} AI Voice Studio. All rights reserved.
            </p>

            <div className="flex items-center space-x-6 text-xs text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/create" className="hover:text-foreground transition-colors">
                Voice Studio
              </Link>
              <Link href="/dashboard/settings" className="hover:text-foreground transition-colors">
                Account Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}