import { AuthCard } from "@daveyplate/better-auth-ui";
import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import Link from "next/link";
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}
export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const isSignInView = path === authViewPaths.signIn;
  const isSignUpView = path === authViewPaths.signUp;

  return (
    <main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
      <div className="w-full max-w-md space-y-4">
        <AuthCard redirectTo="/dashboard" pathname={`/auth/${path}`} />
        {isSignInView ? (
          // <p className="text-center text-sm text-slate-600">
          //   New here?{" "}
          //   <Link
          //     href="/auth/sign-up"
          //     className="font-medium text-violet-600 transition-colors hover:text-violet-500"
          //   >
          //     Create an account
          //   </Link>
          // </p>
        ) : null}
        {isSignUpView ? (
          // <p className="text-center text-sm text-slate-600">
          //   Already have an account?{" "}
          //   <Link
          //     href="/auth/sign-in"
          //     className="font-medium text-violet-600 transition-colors hover:text-violet-500"
          //   >
          //     Sign in
          //   </Link>
          // </p>
        ) : null}
      </div>
    </main>
  );
}
