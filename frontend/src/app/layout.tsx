import "~/styles/globals.css";

import { type Metadata } from "next";
import { Toaster } from "~/components/ui/sonner";
import { Providers } from "~/components/providers";

export const metadata: Metadata = {
  title: "AI Voice Studio | AI-Powered Voice Cloning & Text-to-Speech",
  description:
    "Generate lifelike, studio-quality speech in 23 languages with instant voice cloning, emotion controls, and natural pacing.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
