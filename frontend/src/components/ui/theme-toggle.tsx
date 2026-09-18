"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";

interface ThemeToggleProps {
  className?: string;
  variant?: "ghost" | "outline" | "default";
}

export function ThemeToggle({ className, variant = "outline" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className={`relative h-8 w-8 rounded-lg border-border/50 bg-card/60 hover:bg-accent/60 hover:border-primary/40 transition-all ${className ?? ""}`}
      title="Toggle theme"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {/* Light Mode: Moon icon to switch to Dark */}
      <Moon className="h-4 w-4 text-slate-700 transition-transform duration-200 dark:hidden" />
      {/* Dark Mode: Sun icon to switch to Light */}
      <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hidden dark:block" />
    </Button>
  );
}
