import { redirect } from 'next/navigation';
import CustomerPortalRedirect from '~/components/sidebar/CustomerPortalRedirect';
import { getCurrentSession } from '~/lib/session';

export const dynamic = 'force-dynamic';

export default async function Page() {
  if (process.env.NEXT_PUBLIC_POLAR_ENABLED !== 'true') {
    redirect('/dashboard');
  }

  const session = await getCurrentSession();
  if (!session) {
    redirect('/auth/sign-in');
  }
  return <CustomerPortalRedirect />;
}
