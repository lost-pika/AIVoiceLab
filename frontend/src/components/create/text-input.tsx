"use client";

import { useState } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  Volume2,
  FastForward,
  FileAudio,
  Type,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import type { GeneratedAudio } from "~/types/tts";

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  currentAudio: GeneratedAudio | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onDownload: (audio: GeneratedAudio) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  onOpenTopUp?: () => void;
}

const GENRE_PROMPTS = [
  {
    label: "Podcast Intro",
    text: "Welcome back to today's episode. We're exploring how next-generation AI audio is transforming creative production for storytellers worldwide.",
  },
  {
    label: "Audiobook",
    text: "The evening mist settled quietly over the valley. Inside the old clock tower, an unexpected mechanical click broke forty years of silence.",
  },
  {
    label: "Commercial",
    text: "Engineered for uncompromising performance and sculpted from aerospace titanium. Experience pure speed and precision today.",
  },
  {
    label: "Hindi Dialogue",
    text: "नमस्ते दोस्तों! आज हम बात करेंगे कृत्रिम बुद्धिमत्ता की दुनिया के सबसे रोमांचक आविष्कारों के बारे में। बने रहिए हमारे साथ।",
  },
];

export default function TextInput({
  text,
  setText,
  currentAudio,
  audioRef,
  onDownload,
  onGenerate,
  isGenerating = false,
  onOpenTopUp,
}: TextInputProps) {
  const [copied, setCopied] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const maxChars = 1000;
  const creditsCost = Math.max(1, Math.ceil(text.length / 100));
  const charPercent = Math.min(100, Math.round((text.length / maxChars) * 100));

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      toast.info(`Playback speed: ${speed}x`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Script Editor Card */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Type className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Script Editor
              </CardTitle>
            </div>

            {text.length > 0 && (
              <Button
                onClick={() => setText("")}
                variant="ghost"
                size="sm"
                className="h-6 text-[11px] gap-1 text-muted-foreground hover:text-foreground px-2"
              >
                <X className="h-3 w-3" />
                <span>Clear</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-0 space-y-3">
          {/* Quick Genre Sample Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground mr-1">
              Sample Presets:
            </span>
            {GENRE_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(preset.text)}
                className="rounded-lg border border-border/50 bg-background/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all"
                title={preset.text}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your script here... Up to 1,000 characters per generation."
              maxLength={maxChars}
              rows={7}
              className="w-full rounded-xl border border-border/80 bg-background/60 p-3.5 text-sm font-normal text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Action Bar & Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-border/40">
            {/* Character & Tier Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      charPercent > 90
                        ? "bg-amber-500"
                        : "bg-primary"
                    }`}
                    style={{ width: `${charPercent}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {text.length}/{maxChars} chars
                </span>
              </div>

              {onOpenTopUp && (
                <button
                  type="button"
                  onClick={onOpenTopUp}
                  className="hidden md:flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                  title="Unlock larger script generations"
                >
                  <span>Need up to 10k chars?</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Right actions: Copy + Standard Generate Button */}
            <div className="flex items-center gap-2 justify-end">
              {text.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleCopy(text)}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-1 rounded-md"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              )}

              {onGenerate && (
                <Button
                  type="button"
                  onClick={onGenerate}
                  disabled={isGenerating || !text.trim()}
                  className="h-9 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-semibold text-xs hover:opacity-95 shadow-sm shadow-cyan-500/10 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Generate Speech</span>
                      <span className="rounded-full bg-black/15 px-1.5 py-0.5 text-[10px] font-bold">
                        {creditsCost} {creditsCost === 1 ? "cr" : "cr"}
                      </span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Audio Player */}
      {currentAudio && (
        <Card className="border-border/70 bg-card/90 backdrop-blur-xl shadow-sm">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileAudio className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-xs font-semibold text-foreground">
                    Generated Audio
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground">
                    Format: 48kHz WAV • Language:{" "}
                    <span className="font-semibold uppercase text-foreground">
                      {currentAudio.language}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onDownload(currentAudio)}
                  size="sm"
                  className="h-7 px-2.5 gap-1 text-xs rounded-lg bg-primary/15 hover:bg-primary/25 text-primary border border-primary/20 font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download WAV</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-4 pb-3 pt-0 space-y-2.5">
            {/* Audio Script Preview Quote */}
            <p className="text-xs italic text-foreground/80 bg-background/50 p-2.5 rounded-lg border border-border/40 line-clamp-2 leading-relaxed">
              &ldquo;{currentAudio.text}&rdquo;
            </p>

            {/* Audio Controller */}
            <div className="flex flex-col sm:flex-row items-center gap-3 rounded-xl bg-background/60 p-2.5 border border-border/50">
              <audio
                ref={audioRef}
                controls
                className="w-full h-8 flex-1"
                key={currentAudio.s3_key}
              >
                <source src={currentAudio.audioUrl} type="audio/wav" />
              </audio>

              {/* Tempo / Playback Speed Chips */}
              <div className="flex items-center gap-1 shrink-0 border-l border-border/40 pl-2">
                <FastForward className="h-3 w-3 text-muted-foreground mr-0.5" />
                {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => handleSpeedChange(speed)}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-all ${
                      playbackSpeed === speed
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground bg-muted/40"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}