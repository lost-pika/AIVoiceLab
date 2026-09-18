import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "~/server/db";

export const SESSION_COOKIE_NAME = "auth_session";
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  credits: number;
  createdAt: Date;
}

export interface AuthSession {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
}

/**
 * Creates a cryptographically random session token and persists it in the database and HTTP-only cookie.
 */
export async function createSession(userId: string): Promise<{ session: AuthSession; token: string }> {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  const session = await db.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return { session, token };
}

/**
 * Validates the current session cookie, checks expiration, and retrieves user profile.
 */
export async function getCurrentSession(): Promise<{ user: AuthUser; session: AuthSession } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const session = await db.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            credits: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session || !session.user) {
      return null;
    }

    // Check if session has expired
    if (new Date() >= session.expiresAt) {
      await db.session.delete({ where: { id: session.id } }).catch(() => null);
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    return {
      session: {
        id: session.id,
        token: session.token,
        userId: session.userId,
        expiresAt: session.expiresAt,
      },
      user: session.user,
    };
  } catch (error) {
    console.error("Error retrieving current session:", error);
    return null;
  }
}

/**
 * Invalidates the session in the database and clears the session cookie.
 */
export async function invalidateSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await db.session.deleteMany({
        where: { token },
      });
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch (error) {
    console.error("Error invalidating session:", error);
  }
}

/**
 * Requires an active session or throws an unauthorized error.
 */
export async function requireAuth(): Promise<{ user: AuthUser; session: AuthSession }> {
  const auth = await getCurrentSession();
  if (!auth) {
    throw new Error("Unauthorized");
  }
  return auth;
}
