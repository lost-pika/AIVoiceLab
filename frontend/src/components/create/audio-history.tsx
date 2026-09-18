"use client";

import { useState } from "react";
import {
  Music,
  Play,
  Download,
  Copy,
  Check,
  Clock,
  Radio,
  Share2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import type { GeneratedAudio, Language } from "~/types/tts";

interface AudioHistoryProps {
  generatedAudios: GeneratedAudio[];
  languages: Language[];
  onPlay: (audio: GeneratedAudio) => void;
  onDownload: (audio: GeneratedAudio) => void;
}

export default function AudioHistory({
  generatedAudios,
  languages,
  onPlay,
  onDownload,
}: AudioHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mt-8 rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-6 backdrop-blur-xl shadow-lg">
      {/* Tape Reel Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Radio className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">
              Session Master Tape Reel
            </h2>
            <span className="rounded-full bg-cyan-400/15 border border-cyan-400/30 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
              {generatedAudios.length} {generatedAudios.length === 1 ? "track" : "tracks"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rendered high-fidelity audio takes produced during this session
          </p>
        </div>
      </div>

      {generatedAudios.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {generatedAudios.map((audio, index) => {
            const langObj = languages.find((l) => l.code === audio.language);
            const cardKey = audio.s3_key || `audio-${index}`;

            return (
              <div
                key={cardKey}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-background/50 p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:shadow-md"
              >
                <div>
                  {/* Language and Timestamp */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-semibold text-foreground">
                      <span>{langObj?.flag ?? "🌐"}</span>
                      <span>{langObj?.name ?? audio.language.toUpperCase()}</span>
                    </span>

                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(audio.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Text Script Preview */}
                  <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-foreground/85 font-normal">
                    &ldquo;{audio.text}&rdquo;
                  </p>
                </div>

                {/* Master Track Actions */}
                <div className="pt-2 border-t border-border/40 flex items-center gap-1.5">
                  <Button
                    onClick={() => onPlay(audio)}
                    size="sm"
                    className="h-7 flex-1 gap-1 text-xs font-bold rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black shadow-xs"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    Audition
                  </Button>

                  <Button
                    onClick={() => onDownload(audio)}
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 border-border/70 text-muted-foreground hover:text-foreground"
                    title="Download WAV"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    onClick={() => handleCopy(audio.text, cardKey)}
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 border-border/70 text-muted-foreground hover:text-foreground"
                    title="Copy Script"
                  >
                    {copiedId === cardKey ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
            <Music className="h-5 w-5 text-muted-foreground/60" />
          </div>

          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Session Tape Empty
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto">
            Select a voice persona, enter your script above, and hit &ldquo;Synthesize Audio&rdquo; to begin recording your session tracks.
          </p>
        </div>
      )}
    </div>
  );
}