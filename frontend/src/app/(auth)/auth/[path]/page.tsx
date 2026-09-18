import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SignInForm } from "~/components/auth/sign-in-form";
import { SignUpForm } from "~/components/auth/sign-up-form";
import { Loader2 } from "lucide-react";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ path: "sign-in" }, { path: "sign-up" }];
}

function AuthLoadingFallback() {
  return (
    <div className="flex h-96 w-full max-w-md items-center justify-center rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  if (path !== "sign-in" && path !== "sign-up") {
    notFound();
  }

  return (
    <main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
      <Suspense fallback={<AuthLoadingFallback />}>
        {path === "sign-in" ? <SignInForm /> : <SignUpForm />}
      </Suspense>
    </main>
  );
}
