"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "~/lib/auth-client";

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
