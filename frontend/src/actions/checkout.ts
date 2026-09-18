"use server";

import { headers } from "next/headers";
import { getCurrentSession } from "~/lib/session";
import { polar, getOrCreatePolarProduct, CREDIT_TIERS } from "~/server/polar";

interface CreateCheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Creates a hosted Polar checkout session for credit purchasing.
 */
export async function createCheckoutSession(
  packId: string
): Promise<CreateCheckoutResult> {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id || !session.user.email) {
      return { success: false, error: "Please sign in to purchase credits." };
    }

    const tier = CREDIT_TIERS[packId];
    if (!tier) {
      return { success: false, error: `Invalid credit tier: ${packId}` };
    }

    const productId = await getOrCreatePolarProduct(packId);

    // Resolve current application base URL
    const headerList = await headers();
    const host = headerList.get("host") ?? "localhost:3000";
    const proto =
      headerList.get("x-forwarded-proto") ??
      (host.includes("localhost") ? "http" : "https");
    const origin = `${proto}://${host}`;

    const checkout = await polar.checkouts.create({
      products: [productId],
      externalCustomerId: session.user.id,
      customerEmail: session.user.email,
      customerName: session.user.name ?? undefined,
      metadata: {
        userId: session.user.id,
        credits: tier.amount,
        packId: tier.id,
      },
      successUrl: `${origin}/dashboard?payment=success&credits=${tier.amount}`,
      returnUrl: `${origin}/dashboard`,
    });

    if (!checkout?.url) {
      return {
        success: false,
        error: "Failed to generate checkout link from payment provider.",
      };
    }

    return {
      success: true,
      url: checkout.url,
    };
  } catch (error) {
    console.error("Create checkout error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to initiate checkout session.",
    };
  }
}
