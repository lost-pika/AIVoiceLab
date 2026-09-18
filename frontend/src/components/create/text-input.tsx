"use client";

import { useState } from "react";
import { X, Download, Copy, Check, Sparkles, Volume2 } from "lucide-react";
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

const SAMPLE_PROMPTS = [
  "Welcome to AI Voice Studio, where your words come alive with lifelike emotion and clarity.",
  "In a world driven by artificial intelligence, your authentic voice is your greatest superpower.",
  "Breaking news: Researchers unveil a groundbreaking new AI model capable of expressive multilingual synthesis.",
  "नमस्ते! एआई वॉयस स्टूडियो में आपका स्वागत है। आपकी आवाज़, आपकी पहचान।",
];

export default function TextInput({
  text,
  setText,
  currentAudio,
  audioRef,
  onDownload,
}: TextInputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    toast.success("Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const charPercent = Math.min(100, Math.round((text.length / 500) * 100));

  return (
    <Card className="border-border/70 bg-card/70 backdrop-blur-xl shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Script & Prompt
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter your script or choose a quick prompt to synthesize speech
            </p>
          </div>
          {text.length > 0 && (
            <Button
              onClick={() => setText("")}
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Quick Prompts Chips */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-medium text-muted-foreground mr-1">
            Try a prompt:
          </span>
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setText(prompt)}
              className="text-[11px] rounded-full px-2.5 py-1 bg-muted/60 hover:bg-primary/15 text-muted-foreground hover:text-primary transition-colors border border-border/50 text-left line-clamp-1 max-w-[280px]"
              title={prompt}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here... Supports up to 500 characters in any of the 23 supported languages."
            maxLength={500}
            rows={7}
            className="w-full rounded-xl border border-border/80 bg-background/60 p-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />

          {/* Character Counter Bar */}
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    charPercent > 90 ? "bg-amber-500" : "bg-primary"
                  }`}
                  style={{ width: `${charPercent}%` }}
                />
              </div>
              <span className="tabular-nums font-mono text-[11px]">
                {text.length}/500 chars
              </span>
            </div>

            {text.length > 0 && (
              <button
                type="button"
                onClick={() => handleCopy(text)}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>{copied ? "Copied" : "Copy text"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Latest Generation Live Card */}
        {currentAudio && (
          <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    Latest Generation
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Language:{" "}
                    <span className="font-medium uppercase text-primary">
                      {currentAudio.language}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  onClick={() => onDownload(currentAudio)}
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2.5 text-xs border-primary/30 hover:bg-primary/10"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground/90 italic line-clamp-2 mb-3 bg-background/40 p-2 rounded-md border border-border/40">
              &ldquo;{currentAudio.text}&rdquo;
            </p>

            {/* Custom Styled Audio Player */}
            <div className="flex items-center gap-3 rounded-lg bg-background/80 backdrop-blur-sm p-2 border border-border/60">
              <div className="flex items-center gap-1 px-2">
                <span className="audio-bar h-3 w-1 bg-primary rounded-full"></span>
                <span
                  className="audio-bar h-5 w-1 bg-primary rounded-full"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="audio-bar h-4 w-1 bg-primary rounded-full"
                  style={{ animationDelay: "0.4s" }}
                ></span>
                <span
                  className="audio-bar h-6 w-1 bg-primary rounded-full"
                  style={{ animationDelay: "0.1s" }}
                ></span>
              </div>
              <audio
                ref={audioRef}
                controls
                className="w-full h-8"
                key={currentAudio.s3_key}
              >
                <source src={currentAudio.audioUrl} type="audio/wav" />
              </audio>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}