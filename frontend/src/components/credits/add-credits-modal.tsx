"use client";

import React, { useState } from "react";
import { Coins, Zap, Check, Gift, Loader2, CreditCard } from "lucide-react";
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
import { createCheckoutSession } from "~/actions/checkout";
import { MockCheckoutModal } from "~/components/credits/mock-checkout-modal";
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
    desc: "Quick voice tests & short audio snippets (~5,000 chars).",
    badge: null,
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
  },
  {
    id: "creator",
    amount: 200,
    price: "$15",
    title: "Creator Studio",
    desc: "Podcasts, long scripts, and content creators (~20,000 chars).",
    badge: "Most Popular",
    gradient: "from-violet-500/20 via-primary/20 to-cyan-500/20 border-primary/40 shadow-lg shadow-primary/5",
  },
  {
    id: "pro",
    amount: 500,
    price: "$30",
    title: "Studio Pro",
    desc: "Heavy production, multi-language & audiobooks (~50,000 chars).",
    badge: "Best Value",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
  },
];

const polarEnabled = process.env.NEXT_PUBLIC_POLAR_ENABLED === "true";

export function AddCreditsModal({
  currentCredits,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onCreditsAdded,
}: AddCreditsModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string>("creator");
  const [mockCheckoutOpen, setMockCheckoutOpen] = useState(false);
  const router = useRouter();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? setControlledOpen : setInternalOpen;

  // Free daily claim
  const handleDailyClaim = async () => {
    setIsLoading(true);
    try {
      const res = await addCreditsAction(25);
      if (!res.success) throw new Error(res.error ?? "Failed to claim bonus");

      toast.success("Daily bonus claimed! +25 credits added.", {
        description: `New balance: ${res.credits ?? ""} credits.`,
      });

      if (res.credits !== undefined) {
        window.dispatchEvent(new CustomEvent("credits-updated", { detail: res.credits }));
        onCreditsAdded?.(res.credits);
      }

      router.refresh();
      setIsOpen?.(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error claiming bonus");
    } finally {
      setIsLoading(false);
    }
  };

  // Main "Buy Credits" handler
  const handleBuyCredits = async () => {
    if (polarEnabled) {
      setIsLoading(true);
      try {
        const result = await createCheckoutSession(selectedPack);
        if (!result.success || !result.url) {
          throw new Error(result.error ?? "Could not initiate checkout.");
        }
        window.location.href = result.url;
        return;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error starting checkout");
        setIsLoading(false);
      }
    } else {
      // Open demo payment modal
      setIsOpen?.(false);
      setMockCheckoutOpen(true);
    }
  };

  const selectedPackData = CREDIT_PACKS.find((p) => p.id === selectedPack);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {(trigger || children) && (
          <DialogTrigger asChild>{trigger || children}</DialogTrigger>
        )}
        <DialogContent className="max-w-xl p-6 border-border/80 bg-card/95 backdrop-blur-xl">
          <DialogHeader className="text-left mb-2 pr-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  <Coins className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    Top Up Audio Credits
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Choose a credit package or claim your daily bonus
                  </DialogDescription>
                </div>
              </div>
              {currentCredits !== undefined && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-right shrink-0">
                  <span className="block text-[9px] font-medium text-amber-600 dark:text-amber-400">
                    Current Balance
                  </span>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
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
                  Daily Bonus: +25 Free Credits
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Claim 25 free credits every day for testing.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={handleDailyClaim}
              className="h-8 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold shrink-0"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Claim Free"}
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

          {/* Action Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-4">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              1 Credit = 100 characters of synthesized audio
            </p>
            <Button
              disabled={isLoading}
              onClick={handleBuyCredits}
              className="gap-2 bg-gradient-to-r from-primary via-indigo-600 to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 text-white shadow-md shadow-primary/20 font-semibold text-xs h-9 px-5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  {`Buy ${selectedPackData?.amount} Credits — ${selectedPackData?.price}`}
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-[10px] text-muted-foreground pt-1">
            🔒 Secure checkout · Cards, Apple Pay & Google Pay accepted
          </p>
        </DialogContent>
      </Dialog>

      {/* Demo payment gateway modal */}
      <MockCheckoutModal
        isOpen={mockCheckoutOpen}
        onClose={() => setMockCheckoutOpen(false)}
        pack={
          (() => {
            const p = CREDIT_PACKS.find((p) => p.id === selectedPack);
            return p
              ? { id: p.id, title: p.title, amount: p.amount, price: p.price, desc: p.desc }
              : null;
          })()
        }
        onSuccess={(newCredits) => {
          onCreditsAdded?.(newCredits);
        }}
      />
    </>
  );
}
