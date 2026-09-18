"use client";

import React, { useState } from "react";
import { useAuth } from "~/lib/auth-client";
import { updateProfileAction, updatePasswordAction } from "~/actions/auth";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Coins,
  User as UserIcon,
  KeyRound,
  Sparkles,
  Plus,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AddCreditsModal } from "~/components/credits/add-credits-modal";

export function AccountSettings() {
  const { user, refreshSession } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme ?? theme ?? "dark";
  const isDark = currentTheme === "dark";

  // Profile form state
  const [name, setName] = useState(user?.name ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (name.trim().length < 2) {
      setProfileMsg({
        type: "error",
        text: "Name must be at least 2 characters",
      });
      return;
    }

    setProfileLoading(true);
    try {
      const res = await updateProfileAction(name);
      if (res.success) {
        setProfileMsg({
          type: "success",
          text: "Profile updated successfully!",
        });
        await refreshSession();
      } else {
        setProfileMsg({
          type: "error",
          text: res.error ?? "Failed to update profile",
        });
      }
    } catch (err) {
      console.error(err);
      setProfileMsg({
        type: "error",
        text: "An error occurred while updating profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword) {
      setPasswordMsg({
        type: "error",
        text: "Please enter your current password",
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({
        type: "error",
        text: "New password must be at least 8 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match" });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await updatePasswordAction({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        setPasswordMsg({
          type: "success",
          text: "Password changed successfully!",
        });
        setCurrentPassword("");
        setNewPassword("");
        confirmPassword && setConfirmPassword("");
      } else {
        setPasswordMsg({
          type: "error",
          text: res.error ?? "Failed to change password",
        });
      }
    } catch (err) {
      console.error(err);
      setPasswordMsg({
        type: "error",
        text: "An error occurred while changing password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Credits & Usage Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
                <Coins className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Credits & Plan
                </CardTitle>
                <CardDescription className="text-xs">
                  Your generation balance and subscription tier
                </CardDescription>
              </div>
            </div>

            <AddCreditsModal>
              <Button size="sm" className="gap-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 hover:opacity-95">
                <Plus className="h-3.5 w-3.5" />
                Top Up Credits
              </Button>
            </AddCreditsModal>
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-background/50 border border-border/60">
            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">Available Balance</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-foreground">{user?.credits ?? 0}</span>
                <span className="text-xs text-muted-foreground font-semibold">credits</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">Cost per Synthesis</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-foreground">1</span>
                <span className="text-xs text-muted-foreground font-semibold">credit / track</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">Account Tier</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-sm font-bold text-primary flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Creator Studio
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserIcon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">Profile Information</CardTitle>
              <CardDescription className="text-xs">
                Update your account display name and view your registered email
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {profileMsg && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-xs ${
                profileMsg.type === "success"
                  ? "border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
                  : "border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {profileMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Registered Email</label>
              <input
                type="text"
                disabled
                value={user?.email ?? ""}
                className="w-full rounded-lg border border-input bg-muted/40 px-3 py-2 text-xs text-muted-foreground cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground">Email address cannot be changed</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button type="submit" disabled={profileLoading} size="sm" className="text-xs bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-xl">
              {profileLoading ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
 
       {/* Studio Appearance Card */}
       <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
         <CardHeader>
           <div className="flex items-center gap-2">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
               <Palette className="h-4 w-4" />
             </div>
             <div>
               <CardTitle className="text-base font-bold text-foreground">Workstation Appearance</CardTitle>
               <CardDescription className="text-xs">
                 Choose your preferred workspace theme. Defaults to Cyber Obsidian with option for Arctic Studio.
               </CardDescription>
             </div>
           </div>
         </CardHeader>
         <CardContent>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
             {/* Dark Mode Card */}
             <button
               type="button"
               onClick={() => setTheme("dark")}
               className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                 isDark
                   ? "border-cyan-400 bg-cyan-500/10 shadow-sm shadow-cyan-500/10 ring-1 ring-cyan-400"
                   : "border-border/60 bg-background/50 hover:border-border hover:bg-background"
               }`}
             >
               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black border border-cyan-500/30 text-cyan-400">
                 <Moon className="h-4 w-4" />
               </div>
               <div className="flex-1">
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-foreground">Cyber Obsidian</span>
                   <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-bold text-cyan-400 uppercase tracking-wider">
                     Default
                   </span>
                 </div>
                 <p className="mt-1 text-[11px] text-muted-foreground">
                   Deep OLED obsidian void with glowing cyan & emerald audio workstation accents.
                 </p>
               </div>
             </button>

             {/* Light Mode Card */}
             <button
               type="button"
               onClick={() => setTheme("light")}
               className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                 !isDark
                   ? "border-cyan-500 bg-cyan-500/10 shadow-sm shadow-cyan-500/10 ring-1 ring-cyan-500"
                   : "border-border/60 bg-background/50 hover:border-border hover:bg-background"
               }`}
             >
               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500">
                 <Sun className="h-4 w-4" />
               </div>
               <div className="flex-1">
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-foreground">Arctic Studio</span>
                   {!isDark && (
                     <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                       Active
                     </span>
                   )}
                 </div>
                 <p className="mt-1 text-[11px] text-muted-foreground">
                   High-contrast pearl surfaces with crisp audio controls for bright environments.
                 </p>
               </div>
             </button>
           </div>
         </CardContent>
       </Card>

       {/* Password Security Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">Change Password</CardTitle>
              <CardDescription className="text-xs">
                Update your account password to ensure your account remains secure
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {passwordMsg && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-xs ${
                passwordMsg.type === "success"
                  ? "border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
                  : "border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {passwordMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">New Password</label>
                <span className="text-[11px] text-muted-foreground">Min. 8 characters</span>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button type="submit" disabled={passwordLoading} size="sm" className="text-xs bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-xl">
              {passwordLoading ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
