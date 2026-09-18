"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Crown, Sparkles } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { AddCreditsModal } from "../credits/add-credits-modal";

export default function Upgrade() {
  const [modalOpen, setModalOpen] = useState(false);
  const polarEnabled = process.env.NEXT_PUBLIC_POLAR_ENABLED === "true";

  const handleUpgrade = async () => {
    if (polarEnabled) {
      await authClient.checkout({
        products: [
          "c0590765-eac9-4c0b-99d2-fc8f98920eba",
          "78276150-2dd9-437b-8fe9-8671df481b66",
          "0f81ee54-c80a-4907-9592-073b0b606af4",
        ],
      });
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="group relative overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-cyan-500/10 text-primary transition-all duration-300 hover:border-primary hover:bg-gradient-to-r hover:from-primary hover:to-indigo-600 hover:text-white hover:shadow-md hover:shadow-primary/20 h-8 px-2.5 text-xs font-semibold rounded-lg"
        onClick={handleUpgrade}
      >
        <div className="flex items-center gap-1.5">
          <Crown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12 text-amber-500 group-hover:text-white" />
          <span>Pro Studio</span>
          <Sparkles className="h-2.5 w-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Button>

      <AddCreditsModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
