"use client";

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from "react";
import { authClient } from "~/lib/auth-client";

export default function CustomerPortalRedirect() {
  const [error, setError] = useState<string | null>(null);
  const portalEnabled = process.env.NEXT_PUBLIC_POLAR_ENABLED === "true";

  useEffect(() => {
    if (!portalEnabled) {
      setError("Customer portal is not enabled in this deployment.");
      return;
    }

    const portal = async () => {
      try {
        await authClient.customer.portal();
      } catch (err) {
        console.error("Customer portal redirect failed:", err);
        setError("Unable to open the customer portal right now. Please try again later.");
      }
    };

    void portal();
  }, [portalEnabled]);

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-base font-semibold text-red-700">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            If you believe this is a configuration issue, verify that
            <span className="font-medium"> NEXT_PUBLIC_POLAR_ENABLED</span> is
            set to <span className="font-medium">true</span> in production.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Loading your customer portal...
        </p>
      </div>
    </div>
  );
}