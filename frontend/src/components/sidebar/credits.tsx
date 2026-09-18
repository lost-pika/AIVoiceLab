import { getUserCredits } from "~/actions/tts";
import { CreditsClient } from "./credits-client";

export default async function Credits() {
  const result = await getUserCredits();
  const credits = result.success ? (result.credits ?? 0) : 0;
  return <CreditsClient initialCredits={credits} />;
}