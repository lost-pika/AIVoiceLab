"use client";

import React, { useState } from "react";
import { Coins, Sparkles, Zap, Check, Gift, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { addCreditsAction } from "~/actions/credits";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddCreditsModalProps {
  currentCredits?: number;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreditsAdded?: (newCredits: number) => void;
}

const CREDIT_PACKS = [
  {
    id: "starter",
    amount: 50,
    price: "$5",
    title: "Starter Pack",
    desc: "Great for quick voice tests and short audio snippets (~5,000 characters).",
    badge: null,
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
  },
  {
    id: "creator",
    amount: 200,
    price: "$15",
    title: "Creator Studio",
    desc: "Perfect for content creators, podcasts, and long scripts (~20,000 characters).",
    badge: "Most Popular",
    gradient: "from-violet-500/20 via-primary/20 to-cyan-500/20 border-primary/40 shadow-lg shadow-primary/5",
  },
  {
    id: "pro",
    amount: 500,
    price: "$30",
    title: "Studio Pro",
    desc: "For heavy production, multi-language narration, and long audiobooks (~50,000 characters).",
    badge: "Best Value",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
  },
];

export function AddCreditsModal({
  currentCredits,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onCreditsAdded,
}: AddCreditsModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string>("creator");
  const router = useRouter();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? setControlledOpen : setInternalOpen;

  const handleTopUp = async (amount: number, packTitle: string) => {
    setIsAdding(true);
    try {
      const res = await addCreditsAction(amount);
      if (!res.success) {
        throw new Error(res.error ?? "Failed to add credits");
      }

      toast.success(`Successfully added ${amount} credits to your account!`, {
        description: `Your new balance is ${res.credits ?? ""} credits.`,
      });

      if (res.credits !== undefined && onCreditsAdded) {
        onCreditsAdded(res.credits);
      }

      router.refresh();
      setIsOpen?.(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error adding credits");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {(trigger || children) && (
        <DialogTrigger asChild>{trigger || children}</DialogTrigger>
      )}
      <DialogContent className="max-w-xl p-6 border-border/80 bg-card/95 backdrop-blur-xl">
        <DialogHeader className="text-left mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black shadow-md shadow-amber-500/20">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  Top Up Audio Credits
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Choose a credit package or claim instant bonus credits
                </DialogDescription>
              </div>
            </div>
            {currentCredits !== undefined && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-right">
                <span className="block text-[10px] font-medium text-amber-600 dark:text-amber-400">
                  Current Balance
                </span>
                <span className="text-sm font-black text-amber-700 dark:text-amber-300">
                  {currentCredits} Credits
                </span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Free Daily Claim Banner */}
        <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                Instant Daily Bonus: +25 Free Credits
              </p>
              <p className="text-[11px] text-muted-foreground">
                Enjoy 25 free credits on us for testing your voice clones!
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={isAdding}
            onClick={() => handleTopUp(25, "Daily Bonus")}
            className="h-8 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold shrink-0"
          >
            {isAdding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Claim Free"}
          </Button>
        </div>

        {/* Credit Packages */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1">
          {CREDIT_PACKS.map((pack) => {
            const isSelected = selectedPack === pack.id;
            return (
              <div
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                  isSelected
                    ? "ring-2 ring-primary border-primary " + pack.gradient
                    : "border-border/60 bg-card hover:border-border"
                }`}
              >
                {pack.badge && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-primary to-cyan-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                    {pack.badge}
                  </span>
                )}
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xl font-black text-foreground">
                      +{pack.amount}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {pack.price}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground mb-1">
                    {pack.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {pack.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span>Instant delivery</span>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-4">
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            1 Credit = 100 characters of natural synthesized audio
          </p>
          <Button
            disabled={isAdding}
            onClick={() => {
              const pack = CREDIT_PACKS.find((p) => p.id === selectedPack);
              if (pack) {
                handleTopUp(pack.amount, pack.title);
              }
            }}
            className="gap-2 bg-gradient-to-r from-primary via-indigo-600 to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 text-white shadow-md shadow-primary/20 font-semibold text-xs h-9 px-5"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding Credits...
              </>
            ) : (
              <>
                <Coins className="h-4 w-4" />
                Add {CREDIT_PACKS.find((p) => p.id === selectedPack)?.amount} Credits
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
