"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Play, Pause, Volume2 } from "lucide-react";
import Link from "next/link";

export default function DemoSection() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const naturalSpeechSamples = [
    {
      id: "friendly-female",
      text: "Hi there! I'm excited to help you create amazing voice content today.",
      voiceType: "Sarah (Friendly Warm)",
      audioUrl: "/audio/friendly-female.wav",
    },
    {
      id: "news-anchor",
      text: "Introducing the next generation of refreshment. Duff Beer just got bolder, smoother, and brewed to perfection.",
      voiceType: "Stewie (Animated Tone)",
      audioUrl: "/audio/duff_stewie.wav",
    },
    {
      id: "conan-protest",
      text: "So I want you to get up now. I want all of you to get up out of your chairs. I want you to go to the window, open it, and stick your head out and yell 'I'M MAD AS HELL!",
      voiceType: "Conan (Dramatic Force)",
      audioUrl: "/audio/network_conan.wav",
    },
  ];

  const multilingualSamples = [
    {
      id: "hindi",
      language: "Hindi 🇮🇳",
      text: "नमस्कार! हमारे मंच पर आपका स्वागत है। आपकी आवाज़, आपकी पहचान।",
      audioUrl: "/audio/hindi.wav",
    },
    {
      id: "spanish",
      language: "Spanish 🇪🇸",
      text: "¡Hola! Bienvenido a nuestra plataforma de generación de voz con IA.",
      audioUrl: "/audio/spanish.wav",
    },
    {
      id: "french",
      language: "French 🇫🇷",
      text: "Bonjour! Bienvenue sur notre plateforme de synthèse vocale intelligente.",
      audioUrl: "/audio/french.wav",
    },
    {
      id: "japanese",
      language: "Japanese 🇯🇵",
      text: "こんにちは！私たちのAI音声プラットフォームへようこそ。",
      audioUrl: "/audio/japanese.wav",
    },
  ];

  const handlePlay = (id: string) => {
    if (playingId === id) {
      const audio = document.getElementById(id) as HTMLAudioElement;
      audio?.pause();
      setPlayingId(null);
      return;
    }

    if (playingId) {
      const currentAudio = document.getElementById(
        playingId,
      ) as HTMLAudioElement;
      currentAudio?.pause();
      currentAudio.currentTime = 0;
    }

    const audio = document.getElementById(id) as HTMLAudioElement;
    if (audio) {
      audio
        .play()
        .then(() => {
          setPlayingId(id);
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
        });

      audio.onended = () => {
        setPlayingId(null);
      };

      audio.onerror = () => {
        setPlayingId(null);
      };
    }
  };

  return (
    <section className="py-20 sm:py-28 border-y border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            <Volume2 className="h-3.5 w-3.5" />
            <span>Interactive Showcase</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Hear the Quality in{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Real-Time
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Listen to uncompressed sample outputs produced by our neural synthesis engine
          </p>
        </div>

        {/* Natural & Expressive Speech */}
        <div className="mb-14">
          <h3 className="mb-4 text-center text-lg font-bold text-foreground flex items-center justify-center gap-2">
            <span>Natural & Expressive Voice Synthesis</span>
          </h3>
          <Card className="overflow-hidden border-border/70 bg-card/70 backdrop-blur-md shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/40 border-b border-border/60">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Text Script
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Voice Persona
                    </th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Audio Audition
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {naturalSpeechSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-xs sm:text-sm text-foreground/90 max-w-md">
                        &ldquo;{sample.text}&rdquo;
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-foreground whitespace-nowrap">
                        <span className="rounded-md bg-primary/10 px-2 py-1 text-primary border border-primary/20">
                          {sample.voiceType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <Button
                            variant={playingId === sample.id ? "default" : "outline"}
                            size="sm"
                            className="gap-2 h-8 text-xs font-medium"
                            onClick={() => handlePlay(sample.id)}
                          >
                            {playingId === sample.id ? (
                              <>
                                <Pause className="h-3.5 w-3.5 fill-current" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 fill-current" />
                                Play Sample
                              </>
                            )}
                          </Button>
                          {sample.audioUrl && (
                            <audio
                              id={sample.id}
                              src={sample.audioUrl}
                              preload="none"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Multilingual Support Demo */}
        <div>
          <h3 className="mb-4 text-center text-lg font-bold text-foreground flex items-center justify-center gap-2">
            <span>Multilingual Cross-Dialect Support</span>
          </h3>
          <Card className="overflow-hidden border-border/70 bg-card/70 backdrop-blur-md shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/40 border-b border-border/60">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Language
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Text Script
                    </th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Audio Audition
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {multilingualSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-semibold text-foreground whitespace-nowrap">
                        <span className="rounded-md bg-muted px-2.5 py-1 text-foreground border border-border/60">
                          {sample.language}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs sm:text-sm text-foreground/90 max-w-md">
                        &ldquo;{sample.text}&rdquo;
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <Button
                            variant={playingId === sample.id ? "default" : "outline"}
                            size="sm"
                            className="gap-2 h-8 text-xs font-medium"
                            onClick={() => handlePlay(sample.id)}
                          >
                            {playingId === sample.id ? (
                              <>
                                <Pause className="h-3.5 w-3.5 fill-current" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 fill-current" />
                                Play Sample
                              </>
                            )}
                          </Button>
                          {sample.audioUrl && (
                            <audio
                              id={sample.id}
                              src={sample.audioUrl}
                              preload="none"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-xs text-muted-foreground">
            Ready to generate high-fidelity speech in your own workflow?
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:opacity-95"
            >
              <Volume2 className="h-4 w-4" />
              <span>Launch Studio Free</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
