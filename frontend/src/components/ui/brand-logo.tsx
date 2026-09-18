import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  href?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  className = "",
  href,
}: BrandLogoProps) {
  const iconDimensions = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
    xl: "h-14 w-14",
  }[size];

  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  }[size];

  const logoMark = (
    <div className={`relative flex items-center justify-center ${iconDimensions} rounded-xl bg-gradient-to-br from-cyan-500/20 via-teal-500/10 to-emerald-500/20 border border-cyan-500/30 p-1.5 shadow-md shadow-cyan-500/10 transition-all hover:border-cyan-400/60`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="sonicWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Audio Soundwave / Resonance Pulse */}
        <rect x="4" y="12" width="2.5" height="8" rx="1.25" fill="url(#sonicWaveGrad)" opacity="0.65" />
        <rect x="9" y="8" width="2.5" height="16" rx="1.25" fill="url(#sonicWaveGrad)" opacity="0.85" />
        <rect x="14.75" y="4" width="2.5" height="24" rx="1.25" fill="url(#sonicWaveGrad)" filter="url(#glow)" />
        <rect x="20.5" y="7" width="2.5" height="18" rx="1.25" fill="url(#sonicWaveGrad)" opacity="0.85" />
        <rect x="25.5" y="11" width="2.5" height="10" rx="1.25" fill="url(#sonicWaveGrad)" opacity="0.65" />

        {/* Neural Resonance Orbit Arc */}
        <path
          d="M 6 16 C 6 22, 26 22, 26 16 C 26 10, 6 10, 6 16"
          stroke="url(#sonicWaveGrad)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    </div>
  );

  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {logoMark}

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-foreground ${textSize} font-sans leading-none`}
            >
              VOXI<span className="text-primary bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">CRAFT</span>
            </span>
            <span className="rounded-full bg-primary/15 px-1.5 py-0.2 text-[9px] font-bold text-primary tracking-wider uppercase border border-primary/25">
              LAB
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
            AI Voice Studio
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
