"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "~/lib/auth-client";
import { User, Settings, LogOut, ExternalLink, ChevronUp, Loader2, Shield } from "lucide-react";

interface UserButtonProps {
  className?: string;
  additionalLinks?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
}

export function UserButton({ className, additionalLinks = [] }: UserButtonProps) {
  const { user, isLoading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-11 w-full items-center justify-center rounded-xl border border-border/40 bg-card/50 p-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/sign-in"
        className="flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
      >
        Sign In
      </Link>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  // Filter out any duplicate settings link
  const uniqueAdditionalLinks = additionalLinks.filter(
    (l) => l.href !== "/dashboard/settings"
  );

  return (
    <div className="relative w-full" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/60 p-2 text-left hover:border-primary/40 hover:bg-accent/40 transition-all ${className ?? ""}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-cyan-500 text-xs font-bold text-white shadow-xs">
            {initials}
          </div>
          <div className="truncate">
            <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <ChevronUp
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full min-w-[220px] rounded-2xl border border-border/70 bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in-0 zoom-in-95">
          <div className="px-3 py-2.5 border-b border-border/40">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                Free Plan
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Settings</span>
            </Link>

            {uniqueAdditionalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
              >
                {link.icon ?? <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-border/40 pt-1">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              {isSigningOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
