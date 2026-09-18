"use client";

import React, { useState, useEffect } from "react";
import { Coins, Plus } from "lucide-react";
import { AddCreditsModal } from "../credits/add-credits-modal";

interface CreditsClientProps {
  initialCredits: number;
}

export function CreditsClient({ initialCredits }: CreditsClientProps) {
  const [credits, setCredits] = useState(initialCredits);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setCredits(initialCredits);
  }, [initialCredits]);

  useEffect(() => {
    const handleCreditsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === "number") {
        setCredits(customEvent.detail);
      }
    };
    window.addEventListener("credits-updated", handleCreditsUpdated);
    return () =>
      window.removeEventListener("credits-updated", handleCreditsUpdated);
  }, []);

  const handleCreditsChange = (newAmount: number) => {
    setCredits(newAmount);
    window.dispatchEvent(
      new CustomEvent("credits-updated", { detail: newAmount }),
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="group relative flex items-center justify-between gap-2.5 w-full rounded-xl border border-border/60 bg-gradient-to-r from-card/80 via-card/50 to-muted/20 px-3 py-2 text-left shadow-xs hover:border-amber-500/40 hover:bg-accent/40 transition-all duration-200"
        title="Click to add more credits"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 group-hover:scale-105 transition-all">
            <Coins className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors">
                {credits}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                credits
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
          <Plus className="h-3 w-3" />
          <span>Top Up</span>
        </div>
      </button>

      <AddCreditsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentCredits={credits}
        onCreditsAdded={handleCreditsChange}
      />
    </>
  );
}
