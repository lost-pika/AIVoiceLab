"use client";

import React, { useState } from "react";
import { useAuth } from "~/lib/auth-client";
import { updateProfileAction, updatePasswordAction } from "~/actions/auth";
import { Loader2, CheckCircle2, AlertCircle, Shield, User as UserIcon, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export function AccountSettings() {
  const { user, refreshSession } = useAuth();

  // Profile form state
  const [name, setName] = useState(user?.name ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (name.trim().length < 2) {
      setProfileMsg({ type: "error", text: "Name must be at least 2 characters" });
      return;
    }

    setProfileLoading(true);
    try {
      const res = await updateProfileAction(name);
      if (res.success) {
        setProfileMsg({ type: "success", text: "Profile updated successfully!" });
        await refreshSession();
      } else {
        setProfileMsg({ type: "error", text: res.error ?? "Failed to update profile" });
      }
    } catch (err) {
      console.error(err);
      setProfileMsg({ type: "error", text: "An error occurred while updating profile" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword) {
      setPasswordMsg({ type: "error", text: "Please enter your current password" });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters" });
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
        setPasswordMsg({ type: "success", text: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        confirmPassword && setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: res.error ?? "Failed to change password" });
      }
    } catch (err) {
      console.error(err);
      setPasswordMsg({ type: "error", text: "An error occurred while changing password" });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Profile Card */}
      <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </div>
          <CardDescription>
            Update your account display name and view your registered email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profileMsg && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm ${
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
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="text"
                disabled
                value={user?.email ?? ""}
                className="w-full rounded-lg border border-input bg-muted/40 px-3.5 py-2 text-sm text-muted-foreground cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground">Email address cannot be changed</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            <Button type="submit" disabled={profileLoading} size="sm">
              {profileLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Security Card */}
      <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Change Password</CardTitle>
          </div>
          <CardDescription>
            Update your account password to ensure your account remains secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordMsg && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm ${
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
              <label className="text-sm font-medium text-foreground">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <span className="text-xs text-muted-foreground">Min. 8 characters</span>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            <Button type="submit" disabled={passwordLoading} size="sm">
              {passwordLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
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
