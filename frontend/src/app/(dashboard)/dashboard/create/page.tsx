"use client";

import { Loader2, Mic2, Sparkles, Volume2, Cpu, Waves } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  generateSpeech as generateSpeechAction,
  getUserAudioProjects,
} from "~/actions/tts";
import { uploadVoice, getUserUploadedVoices } from "~/actions/voice-upload";
import { toast } from "sonner";
import type {
  GeneratedAudio,
  VoiceFile,
  Language,
  UploadedVoice,
} from "~/types/tts";
import SpeechSettings from "~/components/create/speech-settings";
import TextInput from "~/components/create/text-input";
import AudioHistory from "~/components/create/audio-history";

const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
];

const VOICE_FILES: VoiceFile[] = [
  { name: "Michael (Professional)", s3_key: "samples/voices/Michael.wav" },
  { name: "Sarah (Friendly Warm)", s3_key: "samples/voices/friendly-female.wav" },
  { name: "Conan (Cinematic Drama)", s3_key: "samples/voices/network_conan.wav" },
  { name: "Stewie (Animated Tone)", s3_key: "samples/voices/duff_stewie.wav" },
  { name: "Spanish Native", s3_key: "samples/voices/spanish.wav" },
  { name: "French Native", s3_key: "samples/voices/french.wav" },
  { name: "Japanese Native", s3_key: "samples/voices/japanese.wav" },
  { name: "Hindi Native", s3_key: "samples/voices/hindi.wav" },
];

export default function CreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedVoice, setSelectedVoice] = useState(
    VOICE_FILES[0]?.s3_key ?? "samples/voices/Michael.wav",
  );

  const [exaggeration, setExaggeration] = useState(0.5);
  const [cfgWeight, setCfgWeight] = useState(0.5);
  const [generatedAudios, setGeneratedAudios] = useState<GeneratedAudio[]>([]);
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudio | null>(null);
  const [userUploadedVoices, setUserUploadedVoices] = useState<UploadedVoice[]>(
    [],
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchUserUploadedVoices = async () => {
    const result = await getUserUploadedVoices();
    if (result.success) {
      setUserUploadedVoices(result.voices);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [, projectsResult, voicesResult] = await Promise.all([
          authClient.getSession(),
          getUserAudioProjects(),
          getUserUploadedVoices(),
        ]);
        if (projectsResult.success && projectsResult.audioProjects) {
          const mappedProjects = projectsResult.audioProjects.map(
            (project) => ({
              s3_key: project.s3Key,
              audioUrl: project.audioUrl,
              text: project.text,
              language: project.language,
              timestamp: new Date(project.createdAt),
            }),
          );
          setGeneratedAudios(mappedProjects);
        }

        if (voicesResult.success) {
          setUserUploadedVoices(voicesResult.voices);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing data:", error);
        setIsLoading(false);
      }
    };

    void initializeData();
  }, []);

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast.error("Please enter some script text first!");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateSpeechAction({
        text: text,
        voice_s3_key: selectedVoice,
        language: selectedLanguage,
        exaggeration: exaggeration,
        cfg_weight: cfgWeight,
      });

      if (!result.success || !result.audioUrl || !result.s3_key) {
        throw new Error(result.error ?? "Generation failed");
      }

      router.refresh();

      const newAudio: GeneratedAudio = {
        s3_key: result.s3_key,
        audioUrl: result.audioUrl,
        text: text,
        language: selectedLanguage,
        timestamp: new Date(),
      };

      setCurrentAudio(newAudio);
      setGeneratedAudios([newAudio, ...generatedAudios].slice(0, 20));

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch((error) => {
            console.error("Autoplay failed:", error);
          });
        }
      }, 100);

      toast.success("Speech synthesized successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate speech";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = (audio: GeneratedAudio) => {
    setCurrentAudio(audio);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch((error) => {
          console.error("Autoplay failed:", error);
        });
      }
    }, 100);
    toast.info("Auditioning track...");
  };

  const downloadAudio = (audio: GeneratedAudio) => {
    window.open(audio.audioUrl, "_blank");
    toast.success("Download started!");
  };

  const handleVoiceUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB!");
      return;
    }

    setIsUploadingVoice(true);
    try {
      const formData = new FormData();
      formData.append("voice", file);

      const result = await uploadVoice(formData);

      if (!result.success) {
        throw new Error(result.error ?? "Upload failed");
      }

      toast.success("Voice uploaded and indexed!");
      await fetchUserUploadedVoices();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload voice file");
    } finally {
      setIsUploadingVoice(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-xs text-muted-foreground">Initializing Neural Audio Workstation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-black shadow-md shadow-cyan-500/20 font-black">
              <Waves className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Audio Synthesis Deck
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Engine
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Zero-shot voice cloning and multilingual speech synthesis across 23 global languages
          </p>
        </div>

        {/* Hardware Status Strip */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-right backdrop-blur-sm">
            <div className="flex items-center gap-1.5 justify-end">
              <Cpu className="h-3 w-3 text-cyan-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                GPU Inference
              </span>
            </div>
            <span className="text-xs font-bold text-foreground">F5-TTS Multi-Voice</span>
          </div>
        </div>
      </div>

      {/* Main Studio Deck Layout (Voice Selector 5 cols, Teleprompter & Master 7 cols) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5 space-y-4">
          <SpeechSettings
            languages={LANGUAGES}
            voiceFiles={VOICE_FILES}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            exaggeration={exaggeration}
            setExaggeration={setExaggeration}
            cfgWeight={cfgWeight}
            setCfgWeight={setCfgWeight}
            userUploadedVoices={userUploadedVoices}
            isUploadingVoice={isUploadingVoice}
            handleVoiceUpload={handleVoiceUpload}
            text={text}
            isGenerating={isGenerating}
            onGenerate={generateSpeech}
          />
        </div>

        <div className="lg:col-span-7 space-y-4">
          <TextInput
            text={text}
            setText={setText}
            currentAudio={currentAudio}
            audioRef={audioRef}
            onDownload={downloadAudio}
          />
        </div>
      </div>

      {/* Session Master Tape Reel */}
      <AudioHistory
        generatedAudios={generatedAudios}
        languages={LANGUAGES}
        onPlay={playAudio}
        onDownload={downloadAudio}
      />
    </div>
  );
}
