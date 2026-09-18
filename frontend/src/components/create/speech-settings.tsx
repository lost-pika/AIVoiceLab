"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Globe,
  Volume2,
  Upload,
  Play,
  Square,
  Sliders,
  Mic,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Plus,
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
  text?: string;
  isGenerating?: boolean;
  onGenerate?: () => void;
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
}: SpeechSettingsProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"dropdown" | "grid">("dropdown");
  const [showSettings, setShowSettings] = useState(false);
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

  const selectedVoiceObj =
    voiceFiles.find((v) => v.s3_key === selectedVoice) ||
    userUploadedVoices.find((v) => v.s3Key === selectedVoice);

  const selectedPersona = VOICE_PERSONAS[selectedVoice] ?? {
    tag: "Custom Cloned Voice",
    gender: "Male" as const,
    tone: "User Recorded",
    avatar: "🎙️",
  };

  return (
    <div className="space-y-4">
      {/* Voice Selection Panel */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-xl shadow-xs">
        <CardHeader className="pb-2.5 pt-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Mic className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Voice Selection
              </CardTitle>
            </div>

            {/* View Style Switcher */}
            <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-background/50 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("dropdown")}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                  viewMode === "dropdown"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Compact dropdown view"
              >
                <List className="h-3 w-3" />
                <span className="hidden sm:inline">Dropdown</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-3 w-3" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-0 space-y-3">
          {/* Dropdown Mode (Default) */}
          {viewMode === "dropdown" ? (
            <div className="space-y-2.5">
              {/* Voice Selector Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 pr-9 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  >
                    <optgroup label="Preset Studio Voices">
                      {voiceFiles.map((v) => {
                        const persona = VOICE_PERSONAS[v.s3_key];
                        return (
                          <option key={v.s3_key} value={v.s3_key}>
                            {persona?.avatar ?? "🎙️"} {v.name}{" "}
                            {persona?.tag ? `• ${persona.tag}` : ""}
                          </option>
                        );
                      })}
                    </optgroup>

                    {userUploadedVoices.length > 0 && (
                      <optgroup label="Your Custom Cloned Voices">
                        {userUploadedVoices.map((v) => (
                          <option key={v.s3Key} value={v.s3Key}>
                            ✨ {v.name} (Custom Clone)
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>

                {/* Audition Button for Selected Voice */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const customObj = userUploadedVoices.find(
                      (uv) => uv.s3Key === selectedVoice,
                    );
                    handleTogglePreview(e, selectedVoice, customObj?.url);
                  }}
                  className={`h-9 px-3 gap-1.5 text-xs rounded-xl font-medium shrink-0 transition-all ${
                    playingVoice === selectedVoice
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border/60 bg-background/50 hover:bg-muted/40"
                  }`}
                  title="Audition selected voice sample"
                >
                  {playingVoice === selectedVoice ? (
                    <>
                      <Square className="h-3 w-3 fill-current" />
                      <span>Stop Sample</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-current" />
                      <span>Audition Voice</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Active Voice Information Strip */}
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">{selectedPersona.avatar}</span>
                  <div>
                    <span className="font-semibold text-foreground">
                      {selectedVoiceObj?.name ?? "Selected Voice"}
                    </span>
                    <span className="text-[11px] text-muted-foreground ml-2">
                      {selectedPersona.tag}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  {selectedPersona.tone}
                </span>
              </div>
            </div>
          ) : (
            /* Grid View Mode */
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
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
                      className={`group relative flex flex-col justify-between rounded-xl p-3 cursor-pointer transition-all duration-150 border text-left ${
                        isSelected
                          ? "bg-primary/10 border-primary shadow-xs"
                          : "bg-background/50 border-border/60 hover:border-border hover:bg-muted/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{persona.avatar}</span>
                          <div>
                            <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                              {voice.name}
                            </h4>
                            <p className="text-[10px] text-muted-foreground">
                              {persona.tag}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="mt-1 pt-2 border-t border-border/40 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                          {persona.tone}
                        </span>

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleTogglePreview(e, voice.s3_key)}
                          className={`h-6 px-2 text-[10px] gap-1 rounded-md font-medium ${
                            isPlaying
                              ? "bg-primary/20 text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <Square className="h-2.5 w-2.5 fill-current" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-2.5 w-2.5 fill-current" />
                              <span>Audition</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {userUploadedVoices.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
                    Your Cloned Voices
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {userUploadedVoices.map((voice) => {
                      const isSelected = selectedVoice === voice.s3Key;
                      const isPlaying = playingVoice === voice.s3Key;

                      return (
                        <div
                          key={voice.id}
                          onClick={() => setSelectedVoice(voice.s3Key)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-primary/10 border-primary"
                              : "bg-background/50 border-border/60 hover:bg-muted/20"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-base">🎙️</span>
                            <span className="text-xs font-semibold text-foreground truncate">
                              {voice.name}
                            </span>
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={(e) =>
                              handleTogglePreview(e, voice.s3Key, voice.url)
                            }
                            className="h-6 px-2 text-[10px]"
                          >
                            {isPlaying ? (
                              <Square className="h-2.5 w-2.5 fill-current text-primary" />
                            ) : (
                              <Play className="h-2.5 w-2.5 fill-current" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Voice Clone Trigger */}
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label
                htmlFor="voice-upload-input"
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 hover:bg-muted/40 hover:border-primary/40 px-2.5 py-1.5 text-xs font-medium text-foreground transition-all"
              >
                <Upload className="h-3.5 w-3.5 text-primary" />
                <span>Clone Custom Voice (5-10s audio)</span>
                <input
                  id="voice-upload-input"
                  type="file"
                  accept="audio/*"
                  onChange={handleVoiceUpload}
                  disabled={isUploadingVoice}
                  className="hidden"
                />
              </label>
              {isUploadingVoice && (
                <span className="text-[11px] text-muted-foreground animate-pulse">
                  Uploading & analyzing voice...
                </span>
              )}
            </div>

            {/* Subtle Settings Toggle */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sliders className="h-3 w-3" />
              <span>{showSettings ? "Hide Adjustments" : "Adjust Voice"}</span>
            </button>
          </div>

          {/* Collapsible Voice Settings (Expressiveness & Clarity) */}
          {showSettings && (
            <div className="rounded-xl border border-border/50 bg-background/60 p-3 space-y-3 pt-2 mt-2">
              {/* Expressiveness Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    Expressiveness / Emotion
                  </span>
                  <span className="font-mono text-muted-foreground">
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
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                />
              </div>

              {/* Clarity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    Clarity & Articulation Guidance
                  </span>
                  <span className="font-mono text-muted-foreground">
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
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target Language Card */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-xl shadow-xs overflow-hidden">
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Globe className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Target Language
              </CardTitle>
            </div>
            <span className="text-[10px] text-muted-foreground">
              23 Languages Supported
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-3.5 pt-0 space-y-2">
          {/* Popular Quick Select Chips */}
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
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              );
            })}
          </div>

          {/* Full Language Selector */}
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
    </div>
  );
}