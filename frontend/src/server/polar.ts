import { Polar } from "@polar-sh/sdk";
import { env } from "~/env";

export interface CreditPack {
  id: "starter" | "creator" | "pro";
  name: string;
  description: string;
  amount: number; // Credits
  priceAmount: number; // in cents, e.g. 500 = $5.00
  priceDisplay: string;
  polarProductId: string;
}

export const CREDIT_TIERS: Record<string, CreditPack> = {
  starter: {
    id: "starter",
    name: "Starter Pack",
    description: "Great for quick voice tests and short audio snippets (~5,000 characters).",
    amount: 50,
    priceAmount: 500, // $5.00
    priceDisplay: "$5",
    polarProductId: "e7c9cacd-37bb-4e6a-9884-6302810029d7",
  },
  creator: {
    id: "creator",
    name: "Creator Studio",
    description: "Perfect for content creators, podcasts, and long scripts (~20,000 characters).",
    amount: 200,
    priceAmount: 1500, // $15.00
    priceDisplay: "$15",
    polarProductId: "19df0e72-022d-4f65-aa96-5b51cf431aa3",
  },
  pro: {
    id: "pro",
    name: "Studio Pro",
    description: "For heavy production, multi-language narration, and long audiobooks (~50,000 characters).",
    amount: 500,
    priceAmount: 3000, // $30.00
    priceDisplay: "$30",
    polarProductId: "5db2631a-af35-4250-b908-2d95eabb66d2",
  },
};

export const polar = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN ?? "",
});

// In-memory cache for resolved Polar product IDs
const productCache: Record<string, string> = {};

/**
 * Resolves or creates a Polar Product corresponding to a credit tier.
 */
export async function getOrCreatePolarProduct(packId: string): Promise<string> {
  const tier = CREDIT_TIERS[packId];
  if (!tier) {
    throw new Error(`Invalid credit pack ID: ${packId}`);
  }

  if (tier.polarProductId) {
    return tier.polarProductId;
  }

  if (productCache[packId]) {
    return productCache[packId];
  }

  try {
    // 1. Check existing products in Polar organization
    const existing = await polar.products.list({
      isArchived: false,
    });

    if (existing?.result?.items) {
      const match = existing.result.items.find(
        (p) =>
          p.name === tier.name ||
          (p.metadata && p.metadata.packId === tier.id)
      );
      if (match) {
        productCache[packId] = match.id;
        return match.id;
      }
    }

    // 2. Create the product if not yet in Polar
    const created = await polar.products.create({
      name: tier.name,
      description: tier.description,
      prices: [
        {
          amountType: "fixed",
          priceAmount: tier.priceAmount,
          priceCurrency: "usd",
        },
      ],
      metadata: {
        packId: tier.id,
        credits: tier.amount,
      },
    });

    productCache[packId] = created.id;
    return created.id;
  } catch (err) {
    console.error("Error resolving Polar product:", err);
    throw new Error(`Failed to initialize Polar product for ${tier.name}`);
  }
}
