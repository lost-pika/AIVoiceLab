"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "~/lib/session";
import { db } from "~/server/db";

interface AddCreditsResult {
  success: boolean;
  credits?: number;
  error?: string;
}

export async function addCreditsAction(
  amount: number,
): Promise<AddCreditsResult> {
  try {
    const session = await getCurrentSession();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    if (!amount || amount <= 0 || amount > 5000) {
      return { success: false, error: "Invalid credit amount requested." };
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        credits: {
          increment: Math.round(amount),
        },
      },
      select: {
        credits: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/create");
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      credits: updatedUser.credits,
    };
  } catch (error) {
    console.error("Add credits error:", error);
    return {
      success: false,
      error: "Failed to add credits. Please try again later.",
    };
  }
}
