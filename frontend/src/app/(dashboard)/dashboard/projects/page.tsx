"use client";

import {
  Loader2,
  Search,
  Calendar,
  Music,
  Trash2,
  Download,
  Plus,
  ArrowUpDown,
  Volume2,
  FolderOpen,
} from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import { getUserAudioProjects, deleteAudioProject } from "~/actions/tts";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
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

type SortBy = "newest" | "oldest" | "name";

export default function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [audioProjects, setAudioProjects] = useState<AudioProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<AudioProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const router = useRouter();

  useEffect(() => {
    const initializeProjects = async () => {
      try {
        const [, projectsResult] = await Promise.all([
          authClient.getSession(),
          getUserAudioProjects(),
        ]);

        if (projectsResult.success && projectsResult.audioProjects) {
          setAudioProjects(projectsResult.audioProjects);
          setFilteredProjects(projectsResult.audioProjects);
        }
      } catch (error) {
        console.error("Audio projects initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeProjects();
  }, []);

  useEffect(() => {
    let filtered = audioProjects.filter((project) =>
      project.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filtered = filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "name":
        filtered = filtered.sort((a, b) => a.text.localeCompare(b.text));
        break;
    }

    setFilteredProjects(filtered);
  }, [audioProjects, searchQuery, sortBy]);

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this master audio take?")) return;

    try {
      const result = await deleteAudioProject(projectId);
      if (result.success) {
        setAudioProjects((prev) => prev.filter((p) => p.id !== projectId));
        toast.success("Master track deleted from vault");
      } else {
        toast.error("Failed to delete project");
      }
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleDownload = (audioUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(audioUrl, "_blank");
    toast.success("Download started!");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-cyan-400 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-xs font-medium">
            Loading Media Vault...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Vault Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <FolderOpen className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Media Vault
            </h1>
            <span className="rounded-full bg-cyan-400/15 border border-cyan-400/30 px-2.5 py-0.5 text-xs font-bold text-cyan-400">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "track" : "tracks"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Browse, audition, export, and manage your synthesized audio library
          </p>
        </div>

        <Button
          onClick={() => router.push("/dashboard/create")}
          className="gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider self-start sm:self-auto shadow-md shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Generation</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-sm shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search master tracks by script content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-background/50 border-border/70 focus:border-cyan-400 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs font-medium">Sort:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="h-9 rounded-xl border border-border/70 bg-background/60 px-3 text-xs text-foreground focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium"
              >
                <option value="newest">Newest Takes</option>
                <option value="oldest">Oldest Takes</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Vault Content */}
      {filteredProjects.length === 0 ? (
        <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20">
              <Volume2 className="text-muted-foreground h-7 w-7" />
            </div>
            <h3 className="mb-1 text-sm font-bold text-foreground uppercase tracking-wider">
              {searchQuery ? "No Matching Tracks Found" : "Vault Empty"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-5">
              {searchQuery
                ? `No audio matches "${searchQuery}". Try a different search query.`
                : "Your media vault is empty. Generate your first AI voiceover to store it here permanently."}
            </p>

            {searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="border-border/70 text-xs rounded-xl"
              >
                Clear Search Filter
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/dashboard/create")}
                size="sm"
                className="gap-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs rounded-xl"
              >
                <Plus className="h-3.5 w-3.5" />
                Synthesize First Track
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:shadow-md"
            >
              <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 mt-0.5">
                    <Music className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-foreground leading-snug line-clamp-2">
                      &ldquo;{project.text}&rdquo;
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 font-bold uppercase text-cyan-400 border border-border/50">
                        {project.language}
                      </span>
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(project.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 border-t md:border-t-0 border-border/40 pt-2 md:pt-0">
                  <audio
                    controls
                    className="h-8 w-44 sm:w-52"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <source src={project.audioUrl} type="audio/wav" />
                  </audio>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-border/70 text-muted-foreground hover:text-foreground rounded-lg"
                    onClick={(e) => handleDownload(project.audioUrl, e)}
                    title="Download Studio WAV"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    onClick={(e) => handleDelete(project.id, e)}
                    title="Delete Track"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
