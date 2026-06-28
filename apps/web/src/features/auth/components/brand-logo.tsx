import { LineChart } from 'lucide-react';
import { cn } from '@salesintel/ui';

/** The gradient app glyph used across auth headers. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-md bg-primary-gradient text-on-primary shadow-sm',
        className,
      )}
    >
      <LineChart className="h-6 w-6" aria-hidden />
    </div>
  );
}
