import { polarClient } from '@polar-sh/better-auth';
import { createAuthClient } from "better-auth/react";

const plugins =
  process.env.NEXT_PUBLIC_POLAR_ENABLED === "true" ? [polarClient()] : [];

export const authClient = createAuthClient({
  plugins,
});
