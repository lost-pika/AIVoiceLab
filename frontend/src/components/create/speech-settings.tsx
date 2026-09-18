"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Globe,
  Volume2,
  Upload,
  Play,
  Square,
  Sparkles,
  Sliders,
  Gauge,
  Loader2,
  Mic,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { Language, VoiceFile, UploadedVoice } from "~/types/tts";

interface SpeechSettingsProps {
  languages: Language[];
  voiceFiles: VoiceFile[];
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  exaggeration: number;
  setExaggeration: (value: number) => void;
  cfgWeight: number;
  setCfgWeight: (value: number) => void;
  userUploadedVoices: UploadedVoice[];
  isUploadingVoice: boolean;
  handleVoiceUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

// Maps preset voice keys to audio preview locations
const PRESET_AUDIO_MAP: Record<string, string> = {
  "samples/voices/Michael.wav": "/audio/network_conan.wav",
  "samples/voices/friendly-female.wav": "/audio/friendly-female.wav",
  "samples/voices/network_conan.wav": "/audio/network_conan.wav",
  "samples/voices/duff_stewie.wav": "/audio/duff_stewie.wav",
  "samples/voices/spanish.wav": "/audio/spanish.wav",
  "samples/voices/french.wav": "/audio/french.wav",
  "samples/voices/japanese.wav": "/audio/japanese.wav",
  "samples/voices/hindi.wav": "/audio/hindi.wav",
};

export default function SpeechSettings({
  languages,
  voiceFiles,
  selectedLanguage,
  setSelectedLanguage,
  selectedVoice,
  setSelectedVoice,
  exaggeration,
  setExaggeration,
  cfgWeight,
  setCfgWeight,
  userUploadedVoices,
  isUploadingVoice,
  handleVoiceUpload,
  text,
  isGenerating,
  onGenerate,
}: SpeechSettingsProps) {
  const creditsNeeded = Math.max(1, Math.ceil(text.length / 100));
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Stop preview audio if selected voice changes
  useEffect(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }
    setIsPlayingPreview(false);
  }, [selectedVoice]);

  // Determine current preview audio URL
  const getSelectedVoiceAudioUrl = (): string | null => {
    // Check if it's an uploaded voice
    const uploaded = userUploadedVoices.find((v) => v.s3Key === selectedVoice);
    if (uploaded?.url) return uploaded.url;

    // Check preset map
    if (PRESET_AUDIO_MAP[selectedVoice]) {
      return PRESET_AUDIO_MAP[selectedVoice];
    }

    // Fallback S3 public URL
    return `https://voice-studio-upload.s3.ap-south-1.amazonaws.com/${selectedVoice}`;
  };

  const handleTogglePreview = () => {
    if (isPlayingPreview) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current.currentTime = 0;
      }
      setIsPlayingPreview(false);
      return;
    }

    const audioUrl = getSelectedVoiceAudioUrl();
    if (!audioUrl) return;

    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(audioUrl);
    } else {
      previewAudioRef.current.src = audioUrl;
    }

    previewAudioRef.current.onended = () => {
      setIsPlayingPreview(false);
    };

    previewAudioRef.current.onerror = () => {
      setIsPlayingPreview(false);
    };

    previewAudioRef.current.play().catch(() => {
      setIsPlayingPreview(false);
    });
    setIsPlayingPreview(true);
  };

  // Find active voice display name
  const currentVoiceName =
    userUploadedVoices.find((v) => v.s3Key === selectedVoice)?.name ??
    voiceFiles.find((v) => v.s3_key === selectedVoice)?.name ??
    "Selected Voice";

  return (
    <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="p-4 pb-3 border-b border-border/40 bg-card/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Studio Controls
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Voice cloning & acoustics
              </p>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
            Chatterbox AI
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* 1. Language Selector */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-primary" />
              Target Language
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">
              23 Supported
            </span>
          </label>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border/70 bg-card px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer shadow-xs"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* 2. Voice Selection & Audition Preview */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Volume2 className="h-3.5 w-3.5 text-primary" />
              Voice Model
            </label>
            <button
              type="button"
              onClick={handleTogglePreview}
              className={`flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-semibold transition-all ${
                isPlayingPreview
                  ? "border-primary bg-primary/20 text-primary animate-pulse"
                  : "border-border/70 bg-card hover:border-primary/40 hover:bg-accent/50 text-foreground"
              }`}
              title="Audition this voice sample"
            >
              {isPlayingPreview ? (
                <>
                  <Square className="h-3 w-3 fill-current text-primary" />
                  <span>Stop Preview</span>
                  <div className="flex items-center gap-0.5 ml-1">
                    <span className="h-2 w-0.5 bg-primary audio-bar" />
                    <span className="h-3 w-0.5 bg-primary audio-bar" />
                    <span className="h-1.5 w-0.5 bg-primary audio-bar" />
                  </div>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current text-primary" />
                  <span>Audition Voice</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border/70 bg-card px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer shadow-xs"
            >
              <optgroup label="✨ Preset Voices">
                {voiceFiles.map((voice) => (
                  <option key={voice.s3_key} value={voice.s3_key}>
                    👤 {voice.name}
                  </option>
                ))}
              </optgroup>

              {userUploadedVoices.length > 0 && (
                <optgroup label="🎤 Your Uploaded Voices">
                  {userUploadedVoices.map((voice) => (
                    <option key={voice.id} value={voice.s3Key}>
                      ⚡ {voice.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* 3. Voice Clone Upload Box */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5 text-primary" />
              Clone Custom Voice
            </span>
            <span className="text-[10px] text-muted-foreground">WAV or MP3</span>
          </label>

          <div className="relative rounded-xl border-2 border-dashed border-border/70 hover:border-primary/50 bg-card/40 p-3 transition-colors text-center group cursor-pointer">
            {isUploadingVoice ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground ml-2 font-medium">
                  Uploading voice sample to S3...
                </span>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleVoiceUpload}
                  className="hidden"
                />
                <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  Upload audio sample (under 10MB)
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  10-30s of clean speech without background noise
                </span>
              </label>
            )}
          </div>
        </div>

        {/* 4. Sliders for Emotion & Pacing */}
        <div className="space-y-3 pt-1">
          {/* Emotion Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Emotion & Dynamics
              </span>
              <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-mono font-bold text-foreground">
                {exaggeration.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={exaggeration}
              onChange={(e) => setExaggeration(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
              <span>Subtle / Monotone</span>
              <span>Expressive / Dramatic</span>
            </div>
          </div>

          {/* Pacing Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-cyan-500" />
                CFG Guidance / Cadence
              </span>
              <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-mono font-bold text-foreground">
                {cfgWeight.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={cfgWeight}
              onChange={(e) => setCfgWeight(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-cyan-500 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
              <span>Natural Drift</span>
              <span>Strict Cadence</span>
            </div>
          </div>
        </div>

        {/* 5. Cost Breakdown & Generate Button */}
        <div className="space-y-2.5 pt-2 border-t border-border/50">
          {text.trim() ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-foreground">
                Generation Cost
              </span>
              <span className="text-xs font-bold text-primary">
                {creditsNeeded} {creditsNeeded === 1 ? "credit" : "credits"}{" "}
                <span className="text-[10px] font-normal text-muted-foreground">
                  ({text.length} chars)
                </span>
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground text-center py-1">
              Type text in the script editor to calculate credits
            </p>
          )}

          <Button
            onClick={onGenerate}
            disabled={isGenerating || !text.trim()}
            className="w-full h-11 gap-2 rounded-xl bg-gradient-to-r from-primary via-indigo-600 to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 text-white font-bold text-xs shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-primary/40 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Synthesizing Audio on GPU...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Speech</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}