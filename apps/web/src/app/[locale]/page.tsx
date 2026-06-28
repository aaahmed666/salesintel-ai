import { redirect } from '@/i18n/navigation';
import { ROUTES } from '@salesintel/config';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  // The platform entry point is the sign-in screen until a dashboard exists.
  redirect({ href: ROUTES.auth.login, locale });
}
