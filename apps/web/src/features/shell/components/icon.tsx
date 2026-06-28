import { cn } from '@salesintel/ui';

interface IconProps {
  /** Material Symbols Outlined ligature name, e.g. `insights`. */
  name: string;
  className?: string;
  /** Optical size in px; maps to font-size for crisp rendering. */
  size?: number;
  filled?: boolean;
  'aria-hidden'?: boolean;
}

/**
 * Thin wrapper around the Material Symbols Outlined webfont so the design's
 * iconography renders 1:1. Decorative by default; pass an accessible label via
 * a wrapping element when the icon is meaningful on its own.
 */
export function Icon({ name, className, size = 24, filled = false, ...rest }: IconProps) {
  return (
    <span
      aria-hidden={rest['aria-hidden'] ?? true}
      className={cn('material-symbols-outlined select-none', className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
