"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Crown } from "lucide-react";
import { AddCreditsModal } from "../credits/add-credits-modal";

export default function Upgrade() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="group relative overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-cyan-500/10 text-primary transition-all duration-300 hover:border-primary hover:bg-gradient-to-r hover:from-primary hover:to-indigo-600 hover:text-white hover:shadow-md hover:shadow-primary/20 h-8 px-2.5 text-xs font-semibold rounded-lg"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center gap-1.5">
          <Crown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12 text-amber-500 group-hover:text-white" />
          <span>Top Up Credits</span>
        </div>
      </Button>

      <AddCreditsModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
