"use server";

import { z } from "zod";
import { db } from "~/server/db";
import { hashPassword, verifyPassword } from "~/lib/password";
import { createSession, getCurrentSession, invalidateSession } from "~/lib/session";

const SignUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SignInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export interface AuthActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Register a new user and establish a session.
 */
export async function signUpAction(data: z.infer<typeof SignUpSchema>): Promise<AuthActionResult> {
  try {
    const validated = SignUpSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const { name, email, password } = validated.data;

    // Check if email already registered
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    // Hash password with bcrypt
    const hashedPassword = await hashPassword(password);

    // Create user with default 20 starter credits
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        credits: 20,
      },
    });

    // Create session and set HTTP-only cookie
    await createSession(user.id);

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during sign up. Please try again.",
    };
  }
}

/**
 * Authenticate user credentials and establish a session.
 */
export async function signInAction(data: z.infer<typeof SignInSchema>): Promise<AuthActionResult> {
  try {
    const validated = SignInSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const { email, password } = validated.data;

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    // Verify bcrypt password hash
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    // Create session and set cookie
    await createSession(user.id);

    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during sign in. Please try again.",
    };
  }
}

/**
 * Sign out and clear active session.
 */
export async function signOutAction(): Promise<AuthActionResult> {
  try {
    await invalidateSession();
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out" };
  }
}

/**
 * Fetch currently authenticated user session.
 */
export async function getSessionAction(): Promise<AuthActionResult<{ user: unknown }>> {
  try {
    const auth = await getCurrentSession();
    if (!auth) {
      return { success: true, data: { user: null } };
    }
    return { success: true, data: { user: auth.user } };
  } catch (error) {
    console.error("Get session error:", error);
    return { success: false, error: "Failed to fetch session" };
  }
}

/**
 * Change password for current logged-in user.
 */
export async function updatePasswordAction(
  data: z.infer<typeof UpdatePasswordSchema>,
): Promise<AuthActionResult> {
  try {
    const auth = await getCurrentSession();
    if (!auth) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = UpdatePasswordSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const user = await db.user.findUnique({
      where: { id: auth.user.id },
    });

    if (!user || !user.password) {
      return { success: false, error: "User not found or password not set" };
    }

    const isCorrect = await verifyPassword(validated.data.currentPassword, user.password);
    if (!isCorrect) {
      return { success: false, error: "Current password is incorrect" };
    }

    const newHash = await hashPassword(validated.data.newPassword);
    await db.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });

    return { success: true };
  } catch (error) {
    console.error("Update password error:", error);
    return { success: false, error: "Failed to update password" };
  }
}

/**
 * Update user profile name.
 */
export async function updateProfileAction(name: string): Promise<AuthActionResult> {
  try {
    const auth = await getCurrentSession();
    if (!auth) {
      return { success: false, error: "Unauthorized" };
    }

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      return { success: false, error: "Name must be at least 2 characters" };
    }

    await db.user.update({
      where: { id: auth.user.id },
      data: { name: trimmed },
    });

    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
