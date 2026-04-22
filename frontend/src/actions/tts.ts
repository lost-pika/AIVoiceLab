"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { env } from "~/env";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

interface GenerateSpeechData {
  text: string;
  voice_s3_key: string;
  language: string;
  exaggeration: number;
  cfg_weight: number;
}

interface GenerateSpeechResult {
  success: boolean;
  s3_key?: string;
  audioUrl?: string;
  projectId?: string;
  error?: string;
}

const S3_BUCKET_URL =
  "https://ai-voice-studio-sahand.s3.ap-southeast-2.amazonaws.com";

const isModalDashboardUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname === "modal.com" &&
      parsedUrl.pathname.includes("/apps/")
    );
  } catch {
    return false;
  }
};

const getModalProxyAuthHeaders = () => {
  const modalKey = env.MODAL_PROXY_TOKEN_ID ?? env.MODAL_API_KEY;
  const modalSecret = env.MODAL_PROXY_TOKEN_SECRET ?? env.MODAL_API_SECRET;

  if (!modalKey || !modalSecret) {
    return {};
  }

  return {
    "Modal-Key": modalKey,
    "Modal-Secret": modalSecret,
  };
};

export async function generateSpeech(
  data: GenerateSpeechData,
): Promise<GenerateSpeechResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    if (!data.text || !data.voice_s3_key || !data.language) {
      return { success: false, error: "Missing required fields" };
    }

    const creditsNeeded = Math.max(1, Math.ceil(data.text.length / 100));

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.credits < creditsNeeded) {
      return {
        success: false,
        error: `Insufficient credits. Need ${creditsNeeded}, have ${user.credits}`,
      };
    }

    if (isModalDashboardUrl(env.MODAL_API_URL)) {
      return {
        success: false,
        error:
          "MODAL_API_URL is set to a Modal app page, not a POST web endpoint. Replace it with the deployed web endpoint URL for generate_speech.",
      };
    }

    const response = await fetch(env.MODAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getModalProxyAuthHeaders(),
      },
      body: JSON.stringify({
        text: data.text,
        voice_s3_key: data.voice_s3_key,
        language: data.language,
        exaggeration: data.exaggeration ?? 0.5,
        cfg_weight: data.cfg_weight ?? 0.5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 405) {
        return {
          success: false,
          error:
            "The configured MODAL_API_URL does not accept POST requests. Use the deployed Modal web endpoint URL, not the Modal dashboard URL.",
        };
      }

      if (
        response.status === 401 &&
        (errorText.includes("modal-http: invalid credentials") ||
          errorText.includes("modal-http: missing credentials"))
      ) {
        return {
          success: false,
          error:
            "Modal proxy authentication failed. Verify your proxy auth tokens for MODAL_PROXY_TOKEN_ID / MODAL_PROXY_TOKEN_SECRET.",
        };
      }

      return {
        success: false,
        error: errorText || `Failed to generate speech (${response.status})`,
      };
    }

    const result = (await response.json()) as { s3_Key: string };

    const audioUrl = `${S3_BUCKET_URL}/${result.s3_Key}`;

    await db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditsNeeded } },
    });

    const audioProject = await db.audioProject.create({
      data: {
        text: data.text,
        audioUrl,
        s3Key: result.s3_Key,
        language: data.language,
        voiceS3Key: data.voice_s3_key,
        exaggeration: data.exaggeration,
        cfgWeight: data.cfg_weight,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      s3_key: result.s3_Key,
      audioUrl,
      projectId: audioProject.id,
    };
  } catch (error) {
    console.error("Speech generation error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export const getUserAudioProjects = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const audioProjects = await db.audioProject.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, audioProjects };
  } catch (error) {
    console.error("Error fetching audio projects:", error);
    return { success: false, error: "Failed to fetch audio projects" };
  }
});

export const getUserCredits = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", credits: 0 };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user) {
      return { success: false, error: "User not found", credits: 0 };
    }

    return { success: true, credits: user.credits };
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return { success: false, error: "Failed to fetch credits", credits: 0 };
  }
});

export async function deleteAudioProject(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const project = await db.audioProject.findUnique({
      where: { id },
    });

    if (!project || project.userId !== session.user.id) {
      return { success: false, error: "Not found or unauthorized" };
    }

    await db.audioProject.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting audio project:", error);
    return { success: false, error: "Failed to delete audio project" };
  }
}
