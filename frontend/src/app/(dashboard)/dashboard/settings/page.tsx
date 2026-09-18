"use client";

import { AccountSettings } from "~/components/settings/account-settings";

export default function SettingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Account Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your account preferences and security settings
        </p>
      </div>

      <AccountSettings />
    </div>
  );
}
