"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  CreditCard,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  X,
  Zap,
  Info,
} from "lucide-react";
import { addCreditsAction } from "~/actions/credits";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MockCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  pack: {
    id: string;
    title: string;
    amount: number;
    price: string;
    desc: string;
  } | null;
  onSuccess?: (newCredits: number) => void;
}

type CheckoutStep = "form" | "processing" | "success";

const TEST_CARD = "4242 4242 4242 4242";
const TEST_EXPIRY = "12 / 28";
const TEST_CVV = "123";

export function MockCheckoutModal({
  isOpen,
  onClose,
  pack,
  onSuccess,
}: MockCheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("form");
  const [cardNumber, setCardNumber] = useState(TEST_CARD);
  const [expiry, setExpiry] = useState(TEST_EXPIRY);
  const [cvv, setCvv] = useState(TEST_CVV);
  const [name, setName] = useState("");
  const [processingMsg, setProcessingMsg] = useState("Initiating secure session…");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setCardNumber(TEST_CARD);
      setExpiry(TEST_EXPIRY);
      setCvv(TEST_CVV);
      setName("");
    }
  }, [isOpen]);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  };

  const handlePay = async () => {
    if (!pack) return;
    setStep("processing");

    const messages = [
      "Initiating secure session…",
      "Verifying card details…",
      "Contacting payment network…",
      "Authorizing transaction…",
      "Confirming with issuer…",
      "Processing payment…",
    ];

    for (let i = 0; i < messages.length; i++) {
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 300));
      setProcessingMsg(messages[i]!);
    }

    const res = await addCreditsAction(pack.amount);
    if (!res.success) {
      toast.error(res.error ?? "Payment failed. Please try again.");
      setStep("form");
      return;
    }

    setStep("success");

    if (res.credits !== undefined) {
      window.dispatchEvent(new CustomEvent("credits-updated", { detail: res.credits }));
      onSuccess?.(res.credits);
    }

    router.refresh();
  };

  const handleDone = () => {
    onClose();
    toast.success(`Payment successful! +${pack?.amount} credits added.`);
  };

  if (!isOpen || !pack) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl shadow-2xl border border-white/10"
        style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a1d2e 100%)" }}
      >
        {/* Demo badge */}
        <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
          <div className="flex items-center gap-1.5 rounded-b-lg bg-amber-500/20 border-x border-b border-amber-500/40 px-3 py-1">
            <Info className="h-3 w-3 text-amber-400" />
            <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
              Demo Mode · Test Card Pre-filled
            </span>
          </div>
        </div>

        {/* Close button */}
        {step !== "processing" && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* FORM STEP */}
        {step === "form" && (
          <div className="pt-10 pb-6 px-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-white/60">AI Voice Studio</span>
                </div>
                <h2 className="text-lg font-bold text-white">{pack.title}</h2>
                <p className="text-xs text-white/50 mt-0.5">{pack.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-white">{pack.price}</div>
                <div className="text-[10px] text-white/40">One-time</div>
              </div>
            </div>

            {/* Order summary */}
            <div className="rounded-xl border border-white/8 bg-white/4 p-3 mb-4">
              <div className="flex justify-between text-xs text-white/60">
                <span>{pack.title} — {pack.amount} Credits</span>
                <span>{pack.price}</span>
              </div>
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>Taxes</span>
                <span>—</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 mt-2 pt-2">
                <span>Total</span>
                <span>{pack.price}</span>
              </div>
            </div>

            {/* Test card hint */}
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-2 mb-4">
              <Info className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <p className="text-[10px] text-amber-300">
                Test card pre-filled. Click <strong>Pay now</strong> to demo the full payment flow.
              </p>
            </div>

            {/* Card inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="w-full rounded-lg border border-white/12 bg-white/6 px-3 py-2.5 text-sm font-mono text-white placeholder-white/25 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition"
                    placeholder="1234 5678 9012 3456"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                    Expiry
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={7}
                    className="w-full rounded-lg border border-white/12 bg-white/6 px-3 py-2.5 text-sm font-mono text-white placeholder-white/25 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition"
                    placeholder="MM / YY"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    className="w-full rounded-lg border border-white/12 bg-white/6 px-3 py-2.5 text-sm font-mono text-white placeholder-white/25 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition"
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/12 bg-white/6 px-3 py-2.5 text-sm text-white placeholder-white/25 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition"
                  placeholder="Full name on card"
                />
              </div>
            </div>

            <button
              onClick={handlePay}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all active:scale-[0.98]"
            >
              <Lock className="inline h-3.5 w-3.5 mr-2 opacity-80" />
              Pay {pack.price} now
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/25">
              <ShieldCheck className="h-3 w-3" />
              <span>256-bit SSL · PCI DSS Compliant · Powered by Polar</span>
            </div>
          </div>
        )}

        {/* PROCESSING STEP */}
        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-6">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-cyan-500/40 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-cyan-400 animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white mb-1">Processing payment…</p>
              <p className="text-xs text-white/40 transition-all duration-300">{processingMsg}</p>
            </div>
            <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                style={{ animation: "growWidth 3s ease-in-out forwards" }}
              />
            </div>
            <p className="text-[10px] text-white/25">Do not close this window</p>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-12 px-6 gap-5">
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 animate-pulse" />
              <div className="absolute inset-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-black text-white mb-1">Payment Successful!</h3>
              <p className="text-sm text-white/50">
                <span className="font-bold text-emerald-400">+{pack.amount} credits</span> added to your account
              </p>
            </div>

            <div className="w-full rounded-xl border border-white/8 bg-white/4 p-4 text-xs space-y-2">
              <div className="flex justify-between text-white/50">
                <span>Package</span>
                <span className="text-white font-medium">{pack.title}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Credits Added</span>
                <span className="text-emerald-400 font-bold">+{pack.amount}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Amount Charged</span>
                <span className="text-white font-medium">{pack.price}</span>
              </div>
              <div className="flex justify-between text-white/50 border-t border-white/8 pt-2 mt-1">
                <span>Status</span>
                <span className="text-emerald-400 font-bold">✓ Approved</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400 transition-all"
            >
              Continue to Studio →
            </button>

            <p className="text-[10px] text-white/25">A receipt has been sent to your email</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes growWidth {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
