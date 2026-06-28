import { Link } from '@/i18n/navigation';
import { ROUTES } from '@salesintel/config';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-md px-md text-center">
      <p className="font-display text-headline-xl text-primary">404</p>
      <p className="text-body-lg text-on-surface-variant">This page could not be found.</p>
      <Link href={ROUTES.auth.login} className="font-semibold text-primary hover:underline">
        Back to sign in
      </Link>
    </main>
  );
}
