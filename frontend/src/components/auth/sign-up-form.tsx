"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpAction } from "~/actions/auth";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUpAction({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (!result.success) {
        setError(result.error ?? "Failed to sign up");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Sign up error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/90 p-8 shadow-2xl backdrop-blur-sm">
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Sign Up</h2>
        <p className="text-sm text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
            className="w-full rounded-lg border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="w-full rounded-lg border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Password</label>
            <span className="text-xs text-muted-foreground">Min. 8 characters</span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength={8}
              className="w-full rounded-lg border border-input bg-background/50 px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 font-medium shadow-md transition-all mt-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            "Create an account"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/sign-in"
          className="font-semibold text-primary hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
