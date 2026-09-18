"use client";

import { useState } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  Sparkles,
  Volume2,
  FastForward,
  Play,
  FileAudio,
  Radio,
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
}

const GENRE_PROMPTS = [
  {
    label: "Podcast Intro",
    text: "Welcome back to the Deep Tech Chronicles. Today, we're diving into the future of neural voice synthesis and its impact on human creativity.",
  },
  {
    label: "Audiobook Narration",
    text: "The fog rolled quietly over the ancient stone bridge. Inside the observatory, the astronomer leaned forward, heart pounding as the cosmic signal repeated.",
  },
  {
    label: "Commercial Ad",
    text: "Introducing HyperGlide: Engineered with aerospace-grade carbon fiber. Ultra-light, ultra-fast, and built for legends. Experience the difference today.",
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
}: TextInputProps) {
  const [copied, setCopied] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

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

  const charPercent = Math.min(100, Math.round((text.length / 500) * 100));

  return (
    <div className="space-y-4">
      {/* Script Teleprompter Card */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-xl shadow-md">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
                <Radio className="h-3.5 w-3.5" />
              </div>
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Script Teleprompter
                </CardTitle>
              </div>
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
          {/* 1-Click Genre Sample Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Genre Presets:
            </span>
            {GENRE_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(preset.text)}
                className="rounded-lg border border-border/50 bg-background/50 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all"
                title={preset.text}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Teleprompter Textarea */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your script here... Maximum 500 characters per synthesis run."
              maxLength={500}
              rows={8}
              className="w-full rounded-xl border border-border/80 bg-background/60 p-3.5 text-sm font-normal text-foreground placeholder:text-muted-foreground/50 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none leading-relaxed"
            />

            {/* Teleprompter Footer Stats */}
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      charPercent > 90
                        ? "bg-amber-500"
                        : "bg-gradient-to-r from-cyan-400 to-emerald-400"
                    }`}
                    style={{ width: `${charPercent}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] font-medium">
                  {text.length} / 500 characters
                </span>
              </div>

              {text.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleCopy(text)}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copied ? "Copied" : "Copy Script"}</span>
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Audio Master Player Deck */}
      {currentAudio && (
        <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-background/80 to-emerald-500/5 backdrop-blur-xl shadow-lg shadow-cyan-500/5">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-300">
                  <FileAudio className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Master Audio Deck
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground">
                    Format: 48kHz WAV • Language:{" "}
                    <span className="font-bold uppercase text-foreground">
                      {currentAudio.language}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onDownload(currentAudio)}
                  size="sm"
                  className="h-7 px-2.5 gap-1 text-xs rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold shadow-xs shadow-cyan-500/20"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download WAV</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-4 pb-4 pt-0 space-y-3">
            {/* Audio Script Preview Quote */}
            <p className="text-xs italic text-foreground/90 bg-background/50 p-2.5 rounded-lg border border-border/50 line-clamp-2 leading-relaxed">
              &ldquo;{currentAudio.text}&rdquo;
            </p>

            {/* Interactive Player Console */}
            <div className="flex flex-col sm:flex-row items-center gap-3 rounded-xl bg-background/80 p-3 border border-border/70">
              {/* Soundwave Bars Indicator */}
              <div className="flex items-center gap-1 px-1 shrink-0">
                <span className="audio-bar h-2 w-1 bg-cyan-400 rounded-full"></span>
                <span className="audio-bar h-5 w-1 bg-cyan-400 rounded-full"></span>
                <span className="audio-bar h-3.5 w-1 bg-emerald-400 rounded-full"></span>
                <span className="audio-bar h-6 w-1 bg-cyan-400 rounded-full"></span>
                <span className="audio-bar h-4 w-1 bg-emerald-400 rounded-full"></span>
              </div>

              {/* Native HTML5 Audio Controller */}
              <audio
                ref={audioRef}
                controls
                className="w-full h-8 flex-1"
                key={currentAudio.s3_key}
              >
                <source src={currentAudio.audioUrl} type="audio/wav" />
              </audio>

              {/* Tempo / Playback Speed Chips */}
              <div className="flex items-center gap-1 shrink-0 border-l border-border/50 pl-2">
                <FastForward className="h-3 w-3 text-muted-foreground mr-0.5" />
                {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => handleSpeedChange(speed)}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold transition-all ${
                      playbackSpeed === speed
                        ? "bg-cyan-400 text-black"
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