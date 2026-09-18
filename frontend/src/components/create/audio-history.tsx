"use client";

import { useState } from "react";
import { Music, Play, Download, Copy, Check, Clock, Globe } from "lucide-react";
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
    toast.success("Text copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-6 backdrop-blur-xl shadow-lg">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Music className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Session Audio History
            </h2>
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {generatedAudios.length} {generatedAudios.length === 1 ? "track" : "tracks"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your recently generated speech files in this studio session
          </p>
        </div>
      </div>

      {generatedAudios.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {generatedAudios.map((audio, index) => {
            const langObj = languages.find((l) => l.code === audio.language);
            const cardKey = audio.s3_key || `audio-${index}`;

            return (
              <div
                key={cardKey}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-background/50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  {/* Card Header: Language & Timestamp */}
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground">
                      <span>{langObj?.flag ?? "🌐"}</span>
                      <span>{langObj?.name ?? audio.language.toUpperCase()}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(audio.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-foreground/80 font-normal">
                    &ldquo;{audio.text}&rdquo;
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-border/40 flex items-center gap-2">
                  <Button
                    onClick={() => onPlay(audio)}
                    variant="default"
                    size="sm"
                    className="h-8 flex-1 gap-1.5 text-xs font-medium bg-primary/90 hover:bg-primary text-primary-foreground shadow-sm"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Audition
                  </Button>

                  <Button
                    onClick={() => onDownload(audio)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-border/70 text-muted-foreground hover:text-foreground"
                    title="Download Audio"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    onClick={() => handleCopy(audio.text, cardKey)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-border/70 text-muted-foreground hover:text-foreground"
                    title="Copy Text"
                  >
                    {copiedId === cardKey ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
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
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
            <Music className="h-6 w-6 text-muted-foreground/60" />
          </div>

          <h3 className="text-sm font-semibold text-foreground">
            No session recordings yet
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Choose a voice, enter some text above, and click &ldquo;Generate Speech&rdquo; to begin your studio recording history.
          </p>
        </div>
      )}
    </div>
  );
}