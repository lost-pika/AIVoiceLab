"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "~/lib/session";
import { polar } from "~/server/polar";

/**
 * Creates a Polar customer session and redirects the user to the billing portal.
 * Uses the email to find or create a customer in Polar, then generates a short-lived
 * customer portal session URL.
 */
export async function createCustomerPortalSession(): Promise<void> {
  const session = await getCurrentSession();
  if (!session?.user?.id || !session.user.email) {
    redirect("/auth/sign-in");
  }

  try {
    let customerId: string | undefined;

    // Try to find existing customer by email
    try {
      const customersPage = await polar.customers.list({
        email: session.user.email,
      });

      if (customersPage?.result?.items?.length) {
        customerId = customersPage.result.items[0]?.id;
      }
    } catch {
      // If list fails, we'll create a new customer below
    }

    if (!customerId) {
      // Create customer in Polar
      const created = await polar.customers.create({
        email: session.user.email!,
        name: session.user.name ?? undefined,
        externalId: session.user.id,
      });
      customerId = created.id;
    }

    // Generate a short-lived customer portal session
    const portalSession = await polar.customerSessions.create({
      customerId,
    });

    if (portalSession?.customerPortalUrl) {
      redirect(portalSession.customerPortalUrl);
    }

    redirect("/dashboard/settings");
  } catch (err) {
    console.error("Customer portal session error:", err);
    redirect("/dashboard/settings?portal_error=true");
  }
}
