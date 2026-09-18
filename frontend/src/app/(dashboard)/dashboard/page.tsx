"use client";

import {
  Loader2,
  Sparkles,
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
} from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import { getUserAudioProjects } from "~/actions/tts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { AddCreditsModal } from "~/components/credits/add-credits-modal";

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

export default function Dashboard() {
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
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-xs">
            Loading your studio dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-purple-500/10 to-card/50 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Studio Workspace</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Welcome back{user?.name ? `, ${user.name}` : ""}!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create lifelike voice clones, generate expressive multilingual narration, and manage your studio audio tracks with ease.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AddCreditsModal>
              <Button
                variant="outline"
                className="h-10 border-primary/40 bg-background/60 hover:bg-primary/10 gap-2 text-foreground font-medium shadow-sm"
              >
                <Coins className="h-4 w-4 text-amber-500" />
                <span>Add Credits</span>
              </Button>
            </AddCreditsModal>

            <Button
              onClick={() => router.push("/dashboard/create")}
              className="h-10 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20"
            >
              <Mic className="h-4 w-4" />
              <span>Open Voice Studio</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm transition-all hover:border-primary/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Audios
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Music className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {userStats.totalAudioProjects}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Generations completed</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm transition-all hover:border-primary/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {userStats.thisMonth}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Tracks synthesized</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm transition-all hover:border-primary/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              This Week
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {userStats.thisWeek}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Recent studio activity</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm transition-all hover:border-primary/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Credits Balance
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Coins className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {user?.credits ?? 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Available for TTS</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Launch Actions */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Quick Studio Launchpad
          </CardTitle>
          <CardDescription>
            Jump straight into creation or manage your generated media
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              onClick={() => router.push("/dashboard/create")}
              className="group cursor-pointer rounded-xl border border-border/80 bg-background/50 p-5 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-purple-500 text-white shadow-sm mb-3 group-hover:scale-105 transition-transform">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm flex items-center justify-between">
                Text-to-Speech Studio
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Enter your script, pick a voice from 23 languages, and generate high-fidelity audio.
              </p>
            </div>

            <div
              onClick={() => router.push("/dashboard/projects")}
              className="group cursor-pointer rounded-xl border border-border/80 bg-background/50 p-5 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 shadow-sm mb-3 group-hover:scale-105 transition-transform">
                <Music className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm flex items-center justify-between">
                Audio Library
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Browse, search, listen to, and download all your past speech projects.
              </p>
            </div>

            <div
              onClick={() => router.push("/dashboard/settings")}
              className="group cursor-pointer rounded-xl border border-border/80 bg-background/50 p-5 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shadow-sm mb-3 group-hover:scale-105 transition-transform">
                <Settings className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm flex items-center justify-between">
                Account & Top-up
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Manage your credentials, top up generation credits, and configure preferences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Generations Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Music className="h-4 w-4 text-primary" />
              Recent Audio Generations
            </CardTitle>
            <CardDescription>
              The most recent tracks generated across your account
            </CardDescription>
          </div>
          {audioProjects.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/projects")}
              className="text-xs font-semibold text-primary hover:text-primary/80 gap-1"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {audioProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20">
                <Music className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                No audio tracks generated yet
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-4">
                Start turning your text into realistic voices with our AI generator
              </p>
              <Button
                onClick={() => router.push("/dashboard/create")}
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Generate First Audio
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {audioProjects.slice(0, 5).map((audio) => (
                <div
                  key={audio.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/50 p-3.5 transition-all hover:border-primary/40 hover:bg-background/80"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Music className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-semibold text-foreground">
                        {audio.name ?? audio.text}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                        <span className="font-semibold uppercase text-primary">
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
                      className="h-8 w-48"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-border/70"
                      onClick={() => window.open(audio.audioUrl, "_blank")}
                      title="Download"
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
