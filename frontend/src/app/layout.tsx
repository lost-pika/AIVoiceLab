import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { Providers } from "~/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
