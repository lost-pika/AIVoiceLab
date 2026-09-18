"use client";

import {
  Loader2,
  Calendar,
  TrendingUp,
  Coins,
  ArrowRight,
  Music,
  Mic,
  Settings,
  Plus,
  Play,
  Download,
  Activity,
  FolderOpen,
} from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState, Suspense } from "react";
import { getUserAudioProjects } from "~/actions/tts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { AddCreditsModal } from "~/components/credits/add-credits-modal";
import { toast } from "sonner";

interface AudioProject {
  id: string;
  name: string | null;
  text: string;
  audioUrl: string;
  s3Key: string;
  language: string;
  voiceS3Key: string;
  exaggeration: number;
  cfgWeight: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserStats {
  totalAudioProjects: number;
  thisMonth: number;
  thisWeek: number;
}

function DashboardInner() {
  const [isLoading, setIsLoading] = useState(true);
  const [audioProjects, setAudioProjects] = useState<AudioProject[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalAudioProjects: 0,
    thisMonth: 0,
    thisWeek: 0,
  });
  const [user, setUser] = useState<{
    id?: string;
    name?: string;
    email?: string;
    credits?: number;
    createdAt?: string | Date;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Payment success toast from Polar redirect
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const creditsAdded = searchParams.get("credits");
    if (paymentStatus === "success" && creditsAdded) {
      toast.success(`Payment successful! +${creditsAdded} credits added to your account.`, {
        description: "Your credits are now available for generating audio.",
        duration: 6000,
      });
      // Clean up query params from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("credits");
      router.replace(url.pathname);
    }
  }, [searchParams, router]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const [sessionResult, audioResult] = await Promise.all([
          authClient.getSession(),
          getUserAudioProjects(),
        ]);

        if (sessionResult?.data?.user) {
          setUser(sessionResult.data.user as typeof user);
        }

        if (audioResult.success && audioResult.audioProjects) {
          setAudioProjects(audioResult.audioProjects);
        }

        const audios = audioResult.audioProjects ?? [];

        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        setUserStats({
          totalAudioProjects: audios.length,
          thisMonth: audios.filter((p) => new Date(p.createdAt) >= thisMonth).length,
          thisWeek: audios.filter((p) => new Date(p.createdAt) >= thisWeek).length,
        });
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeDashboard();

    const handleCreditsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === "number") {
        setUser((prev) => (prev ? { ...prev, credits: customEvent.detail } : prev));
      }
    };
    window.addEventListener("credits-updated", handleCreditsUpdated);
    return () =>
      window.removeEventListener("credits-updated", handleCreditsUpdated);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-cyan-400 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-xs font-medium">
            Loading Command Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* 4 Studio Metric Widgets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/70 backdrop-blur-sm shadow-sm transition-all hover:border-cyan-400/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Audios
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Music className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {userStats.totalAudioProjects}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Total synthesized tracks</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur-sm shadow-sm transition-all hover:border-emerald-400/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              This Month
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {userStats.thisMonth}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Rendered this month</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur-sm shadow-sm transition-all hover:border-purple-400/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              This Week
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {userStats.thisWeek}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Recent 7 days output</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur-sm shadow-sm transition-all hover:border-amber-400/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Credits Available
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Coins className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {user?.credits ?? 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">TTS generation credits</p>
          </CardContent>
        </Card>
      </div>

      {/* Studio Quick Launchpad */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3 px-6 pt-5">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Mic className="h-4 w-4 text-cyan-400" />
            Studio Launchpad
          </CardTitle>
          <CardDescription className="text-xs">
            Direct shortcuts to your core creation and asset tools
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 px-6 pb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              onClick={() => router.push("/dashboard/create")}
              className="group cursor-pointer rounded-2xl border border-border/80 bg-background/50 p-5 transition-all hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 text-black shadow-md shadow-cyan-500/20 mb-3 group-hover:scale-105 transition-transform">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm flex items-center justify-between">
                Speech Synthesis Deck
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-cyan-400" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Choose from 8 professional voice personas or clone your own voice to generate studio speech.
              </p>
            </div>

            <div
              onClick={() => router.push("/dashboard/projects")}
              className="group cursor-pointer rounded-2xl border border-border/80 bg-background/50 p-5 transition-all hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 shadow-sm mb-3 group-hover:scale-105 transition-transform">
                <FolderOpen className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm flex items-center justify-between">
                Media Vault & Library
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-400" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Search, listen to, download, and organize all your synthesized master tracks.
              </p>
            </div>

            <div
              onClick={() => router.push("/dashboard/settings")}
              className="group cursor-pointer rounded-2xl border border-border/80 bg-background/50 p-5 transition-all hover:-translate-y-1 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 shadow-sm mb-3 group-hover:scale-105 transition-transform">
                <Settings className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm flex items-center justify-between">
                Console Settings & Plans
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-purple-400" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Manage your credentials, update your display profile, and top up credits with 1-click packs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Studio Generations Stream */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3 px-6 pt-5">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Music className="h-4 w-4 text-cyan-400" />
              Recent Studio Tracks
            </CardTitle>
            <CardDescription className="text-xs">
              The latest synthesized audio takes recorded across your workspace
            </CardDescription>
          </div>
          {audioProjects.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/projects")}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 gap-1"
            >
              <span>View Media Vault</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-0 px-6 pb-6">
          {audioProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20">
                <Music className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                No Audio Takes Recorded Yet
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-4">
                Launch the studio deck to transform scripts into lifelike voice recordings
              </p>
              <Button
                onClick={() => router.push("/dashboard/create")}
                size="sm"
                className="gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs"
              >
                <Plus className="h-4 w-4" />
                Synthesize First Track
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {audioProjects.slice(0, 5).map((audio) => (
                <div
                  key={audio.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/50 p-3 transition-all hover:border-cyan-400/40 hover:bg-background/80"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                      <Music className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-bold text-foreground">
                        {audio.name ?? audio.text}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <span className="font-bold uppercase text-cyan-400">
                          {audio.language}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(audio.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <audio
                      src={audio.audioUrl}
                      controls
                      className="h-7 w-44"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0 border-border/70"
                      onClick={() => window.open(audio.audioUrl, "_blank")}
                      title="Download WAV"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={null}>
      <DashboardInner />
    </Suspense>
  );
}
