import { notFound } from "next/navigation";
import { SignInForm } from "~/components/auth/sign-in-form";
import { SignUpForm } from "~/components/auth/sign-up-form";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ path: "sign-in" }, { path: "sign-up" }];
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
      {path === "sign-in" ? <SignInForm /> : <SignUpForm />}
    </main>
  );
}
