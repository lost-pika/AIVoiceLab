import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { env } from "~/env";
import { db } from "~/server/db";

/**
 * POST /api/webhook/polar
 *
 * Receives Polar.sh signed webhook events and processes order payments
 * to increment user credits in the database.
 */
export async function POST(req: NextRequest) {
  const webhookSecret = env.POLAR_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Polar Webhook] POLAR_WEBHOOK_SECRET is not configured.");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 }
    );
  }

  // Read raw body for HMAC verification
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Failed to read request body." }, { status: 400 });
  }

  // Extract standard-webhooks headers for verification
  const webhookHeaders = {
    "webhook-id": req.headers.get("webhook-id") ?? "",
    "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
    "webhook-signature": req.headers.get("webhook-signature") ?? "",
  };

  // Verify signature and parse the event
  let event;
  try {
    event = validateEvent(rawBody, webhookHeaders, webhookSecret);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      console.warn("[Polar Webhook] Invalid signature:", err.message);
      return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
    }
    console.error("[Polar Webhook] Failed to parse webhook event:", err);
    return NextResponse.json({ error: "Failed to parse event." }, { status: 400 });
  }

  // Handle order.paid — primary credit fulfillment event
  if (event.type === "order.paid") {
    const order = event.data;

    try {
      // Extract userId and credits from checkout metadata
      const metadata = order.metadata as Record<string, unknown> | undefined;
      const userId = metadata?.userId as string | undefined;
      const credits = metadata?.credits;
      const creditsToAdd = typeof credits === "number" ? credits : parseInt(String(credits ?? "0"), 10);

      if (!userId) {
        // Fallback: try to match by externalCustomerId
        const externalId = order.customer?.externalId;
        if (!externalId) {
          console.error("[Polar Webhook] No userId or externalCustomerId in order:", order.id);
          return NextResponse.json({ received: true }); // Acknowledge to avoid retries
        }

        if (creditsToAdd > 0) {
          await db.user.update({
            where: { id: externalId },
            data: { credits: { increment: creditsToAdd } },
          });
          revalidatePath("/dashboard");
          revalidatePath("/dashboard/create");
          revalidatePath("/dashboard/settings");
          console.log(`[Polar Webhook] Added ${creditsToAdd} credits to user ${externalId} via externalId fallback.`);
        }

        return NextResponse.json({ received: true });
      }

      if (creditsToAdd <= 0) {
        console.warn("[Polar Webhook] Credits to add is 0 or invalid for order:", order.id);
        return NextResponse.json({ received: true });
      }

      // Atomically increment credits for the user
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { credits: { increment: creditsToAdd } },
        select: { id: true, credits: true },
      });

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/create");
      revalidatePath("/dashboard/settings");

      console.log(
        `[Polar Webhook] ✅ Added ${creditsToAdd} credits to user ${userId}. New balance: ${updatedUser.credits}`
      );
    } catch (dbErr) {
      console.error("[Polar Webhook] Database error while updating credits:", dbErr);
      // Return 500 so Polar retries the webhook
      return NextResponse.json(
        { error: "Database update failed." },
        { status: 500 }
      );
    }
  }

  // Acknowledge all other event types gracefully
  return NextResponse.json({ received: true });
}
