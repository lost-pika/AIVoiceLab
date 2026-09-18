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
  Radio,
  Music2,
  Layers,
  Flame,
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

const PRESET_AUDIO_MAP: Record<string, string> = {
  "samples/voices/Michael.wav": "/audio/friendly-female.wav",
  "samples/voices/friendly-female.wav": "/audio/friendly-female.wav",
  "samples/voices/network_conan.wav": "/audio/network_conan.wav",
  "samples/voices/duff_stewie.wav": "/audio/duff_stewie.wav",
  "samples/voices/spanish.wav": "/audio/spanish.wav",
  "samples/voices/french.wav": "/audio/french.wav",
  "samples/voices/japanese.wav": "/audio/japanese.wav",
  "samples/voices/hindi.wav": "/audio/hindi.wav",
};

const VOICE_PERSONAS: Record<
  string,
  { tag: string; gender: "Male" | "Female"; tone: string; avatar: string }
> = {
  "samples/voices/Michael.wav": {
    tag: "Commercial / Documentary",
    gender: "Male",
    tone: "Authoritative & Deep",
    avatar: "🎙️",
  },
  "samples/voices/friendly-female.wav": {
    tag: "Narrator & Explainer",
    gender: "Female",
    tone: "Warm, Bright & Conversational",
    avatar: "🎧",
  },
  "samples/voices/network_conan.wav": {
    tag: "Cinematic Drama",
    gender: "Male",
    tone: "Passionate & Emphatic",
    avatar: "⚡",
  },
  "samples/voices/duff_stewie.wav": {
    tag: "Animation / Satire",
    gender: "Male",
    tone: "Articulate & High-Pitched",
    avatar: "🎭",
  },
  "samples/voices/spanish.wav": {
    tag: "Latin / Castilian Native",
    gender: "Male",
    tone: "Rhythmic & Natural",
    avatar: "🇪🇸",
  },
  "samples/voices/french.wav": {
    tag: "Parisian Elegance",
    gender: "Female",
    tone: "Smooth & Melodic",
    avatar: "🇫🇷",
  },
  "samples/voices/japanese.wav": {
    tag: "Tokyo Anime / Drama",
    gender: "Female",
    tone: "Clear & Expressive",
    avatar: "🇯🇵",
  },
  "samples/voices/hindi.wav": {
    tag: "Bollywood & Regional",
    gender: "Male",
    tone: "Resonant & Expressive",
    avatar: "🇮🇳",
  },
};

const POPULAR_LANGS = ["en", "hi", "es", "fr", "ja", "de"];

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
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
    };
  }, []);

  const handleTogglePreview = (
    e: React.MouseEvent,
    voiceKey: string,
    audioUrl?: string,
  ) => {
    e.stopPropagation();

    if (playingVoice === voiceKey) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current.currentTime = 0;
      }
      setPlayingVoice(null);
      return;
    }

    const src = audioUrl || PRESET_AUDIO_MAP[voiceKey];
    if (!src) return;

    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio();
    }

    audioPreviewRef.current.src = src;
    audioPreviewRef.current
      .play()
      .then(() => {
        setPlayingVoice(voiceKey);
      })
      .catch((err) => {
        console.error("Preview playback error:", err);
        setPlayingVoice(null);
      });

    audioPreviewRef.current.onended = () => {
      setPlayingVoice(null);
    };

    audioPreviewRef.current.onerror = () => {
      setPlayingVoice(null);
    };
  };

  const getExaggerationLabel = (val: number) => {
    if (val < 0.3) return "Subtle & Neutral";
    if (val < 0.6) return "Natural Studio Balance";
    if (val < 0.85) return "Dramatic & Expressive";
    return "High Theatrical Energy";
  };

  const getCfgLabel = (val: number) => {
    if (val < 0.3) return "Creative Natural Flow";
    if (val < 0.6) return "Balanced Audio Clarity";
    if (val < 0.85) return "Strict Prompt Fidelity";
    return "Ultra-Strict Articulation";
  };

  return (
    <div className="space-y-4">
      {/* Language Matrix Strip */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-xl shadow-md overflow-hidden">
        <CardHeader className="pb-2 pt-3.5 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Globe className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Target Language
              </CardTitle>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              23 Global Dialects
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-3.5 pt-0 space-y-2.5">
          {/* Quick Language Capsules */}
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_LANGS.map((code) => {
              const lang = languages.find((l) => l.code === code);
              if (!lang) return null;
              const isSelected = selectedLanguage === code;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedLanguage(code)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs shadow-primary/30"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              );
            })}
          </div>

          {/* Full Language Dropdown */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.flag} {language.name} ({language.code.toUpperCase()})
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Voice Deck: Interactive Persona Cards Grid */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-xl shadow-md">
        <CardHeader className="pb-2.5 pt-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
                <Music2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Voice Persona Deck
                </CardTitle>
              </div>
            </div>

            <span className="text-[10px] text-primary font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Click card to select</span>
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-0 space-y-2.5">
          {/* Preset Voice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {voiceFiles.map((voice) => {
              const persona = VOICE_PERSONAS[voice.s3_key] ?? {
                tag: "Studio Persona",
                gender: "Male",
                tone: "Natural & Clear",
                avatar: "🎙️",
              };
              const isSelected = selectedVoice === voice.s3_key;
              const isPlaying = playingVoice === voice.s3_key;

              return (
                <div
                  key={voice.s3_key}
                  onClick={() => setSelectedVoice(voice.s3_key)}
                  className={`group relative flex flex-col justify-between rounded-xl p-3 cursor-pointer transition-all duration-200 border text-left ${
                    isSelected
                      ? "bg-primary/10 border-primary/60 shadow-xs shadow-primary/20"
                      : "bg-background/50 border-border/70 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{persona.avatar}</span>
                        <div>
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {voice.name}
                          </h4>
                          <span className="text-[10px] text-muted-foreground font-medium block">
                            {persona.gender} • {persona.tag}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    <p className="text-[10px] text-muted-foreground/80 italic line-clamp-1 mb-2">
                      &ldquo;{persona.tone}&rdquo;
                    </p>
                  </div>

                  {/* In-Card Audition Action */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleTogglePreview(e, voice.s3_key)}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-all ${
                        isPlaying
                          ? "bg-primary text-primary-foreground shadow-xs shadow-primary"
                          : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      title="Audition voice sample"
                    >
                      {isPlaying ? (
                        <>
                          <Square className="h-3 w-3 fill-current" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 fill-current" />
                          <span>Audition</span>
                        </>
                      )}
                    </button>

                    {/* Animated Soundwave for Playing Voice */}
                    {isPlaying && (
                      <div className="flex items-center gap-0.5 pr-1">
                        <span className="audio-bar h-2 w-0.5 bg-primary rounded-full"></span>
                        <span className="audio-bar h-3.5 w-0.5 bg-primary rounded-full"></span>
                        <span className="audio-bar h-2.5 w-0.5 bg-primary rounded-full"></span>
                        <span className="audio-bar h-4 w-0.5 bg-primary rounded-full"></span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* User Uploaded Custom Cloned Voices */}
          {userUploadedVoices.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <span className="text-[11px] font-bold text-foreground block mb-2">
                Your Custom Cloned Voices
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {userUploadedVoices.map((voice) => {
                  const isSelected = selectedVoice === voice.s3Key;
                  const isPlaying = playingVoice === voice.s3Key;

                  return (
                    <div
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.s3Key)}
                      className={`relative flex items-center justify-between rounded-xl p-2.5 cursor-pointer border transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary/60"
                          : "bg-background/40 border-border/70 hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-sm">🧬</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {voice.name}
                          </h4>
                          <span className="text-[10px] text-muted-foreground block">
                            Custom Clone
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) =>
                          handleTogglePreview(e, voice.s3Key, voice.url)
                        }
                        className="ml-2 rounded-md p-1.5 text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted"
                        title="Audition clone sample"
                      >
                        {isPlaying ? (
                          <Square className="h-3 w-3 fill-current text-primary" />
                        ) : (
                          <Play className="h-3 w-3 fill-current" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Voice Clone Dropper Zone */}
          <div className="mt-3 rounded-xl border border-dashed border-border/80 bg-background/30 p-3 text-center transition-all hover:border-primary/40">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Clone a New Voice
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Drop a 5-10s clear WAV/MP3 clip (&lt; 10MB)
                  </span>
                </div>
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleVoiceUpload}
                  disabled={isUploadingVoice}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent/80 transition-colors border border-border/60">
                  {isUploadingVoice ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Cloning...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3 w-3 text-primary" />
                      <span>Upload Clip</span>
                    </>
                  )}
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acoustic Rack Controls: Exaggeration & Guidance Sliders */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-xl shadow-md">
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
              <Sliders className="h-3.5 w-3.5" />
            </div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Acoustic Studio Faders
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-0 space-y-4">
          {/* Exaggeration Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                Expressiveness & Emotion
              </span>
              <span className="font-mono text-[11px] font-bold text-primary">
                {exaggeration.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={exaggeration}
              onChange={(e) => setExaggeration(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-muted rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{getExaggerationLabel(exaggeration)}</span>
              <span>Default: 0.50</span>
            </div>
          </div>

          {/* CFG Guidance Weight Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-emerald-500" />
                Clarity & Pacing Guidance
              </span>
              <span className="font-mono text-[11px] font-bold text-accent">
                {cfgWeight.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={cfgWeight}
              onChange={(e) => setCfgWeight(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-muted rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{getCfgLabel(cfgWeight)}</span>
              <span>Default: 0.50</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Synthesis Master Button Bar */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-emerald-500/10 to-card/80 p-3.5 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Generation Master</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Synthesize script with selected voice clone
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground hidden sm:inline">
              1 Credit / generation
            </span>

            <Button
              onClick={onGenerate}
              disabled={isGenerating || !text.trim()}
              className="h-10 px-6 gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:opacity-90 shadow-md shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 fill-current" />
                  <span>Synthesize Audio</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}