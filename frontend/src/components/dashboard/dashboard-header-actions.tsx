"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Wand2, Coins } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { AddCreditsModal } from "~/components/credits/add-credits-modal";
import { getUserCredits } from "~/actions/tts";

export function DashboardHeaderActions() {
  const pathname = usePathname();
  const [credits, setCredits] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadCredits() {
      try {
        const res = await getUserCredits();
        if (res.success && res.credits !== undefined) {
          setCredits(res.credits);
        }
      } catch (err) {
        console.error("Failed to load header credits:", err);
      }
    }
    void loadCredits();
  }, [pathname]);

  return (
    <div className="flex items-center gap-2.5">
      {/* Credit balance trigger */}
      {credits !== null && (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-2.5 py-1 text-xs font-semibold hover:border-amber-500/40 hover:bg-accent/40 transition-all shadow-xs"
          title="Click to add more credits"
        >
          <Coins className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-foreground font-bold">{credits}</span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">credits</span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Plus className="h-2.5 w-2.5" />
          </span>
        </button>
      )}

      {/* Quick studio action */}
      {pathname !== "/dashboard/create" && (
        <Button
          asChild
          size="sm"
          className="h-8 gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold hover:opacity-95 shadow-md shadow-cyan-500/20 text-xs px-3 hidden sm:flex"
        >
          <Link href="/dashboard/create">
            <Wand2 className="h-3.5 w-3.5" />
            <span>Studio Deck</span>
          </Link>
        </Button>
      )}

      {/* Theme Toggle */}
      <ThemeToggle />

      <AddCreditsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentCredits={credits ?? 0}
        onCreditsAdded={(newAmt) => setCredits(newAmt)}
      />
    </div>
  );
}
