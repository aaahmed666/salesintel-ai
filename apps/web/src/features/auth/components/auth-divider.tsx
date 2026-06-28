export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-md">
      <span className="h-px flex-1 bg-outline-variant/60" />
      <span className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
        {label}
      </span>
      <span className="h-px flex-1 bg-outline-variant/60" />
    </div>
  );
}
