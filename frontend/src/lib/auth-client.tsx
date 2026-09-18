"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSessionAction, signOutAction } from "~/actions/auth";
import { useRouter } from "next/navigation";

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  credits: number;
  createdAt: string | Date;
}

interface AuthContextType {
  user: ClientUser | null;
  isLoading: boolean;
  refreshSession: () => Promise<ClientUser | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refreshSession: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    try {
      const result = await getSessionAction();
      if (result.success && result.data?.user) {
        const u = result.data.user as ClientUser;
        setUser(u);
        return u;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("Failed to load session:", error);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const signOut = useCallback(async () => {
    await signOutAction();
    setUser(null);
    router.push("/auth/sign-in");
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshSession, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Compatible authClient interface for legacy callers.
 */
export const authClient = {
  async getSession() {
    const res = await getSessionAction();
    if (res.success && res.data?.user) {
      return { data: { user: res.data.user as ClientUser }, error: null };
    }
    return { data: null, error: res.error ? new Error(res.error) : null };
  },
  async signOut() {
    await signOutAction();
  },
  async checkout(options?: unknown) {
    console.log("Checkout requested:", options);
  },
  customer: {
    async portal() {
      console.log("Customer portal requested");
    },
  },
};
