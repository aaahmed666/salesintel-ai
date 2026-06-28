import { ShieldCheck, KeyRound } from 'lucide-react';

export function SecurityBadges({ soc2, encryption }: { soc2: string; encryption: string }) {
  return (
    <div className="flex items-center justify-center gap-lg text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
      <span className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" aria-hidden />
        {soc2}
      </span>
      <span className="flex items-center gap-2">
        <KeyRound className="h-4 w-4" aria-hidden />
        {encryption}
      </span>
    </div>
  );
}
