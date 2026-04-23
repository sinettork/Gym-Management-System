import { cn } from '../../lib/utils';

const variants = {
  surface: 'bg-surface text-on-surface-variant',
  success: 'bg-primary-container/40 text-primary',
  error: 'bg-error-container text-error',
  dark: 'bg-inverse-surface text-inverse-on-surface',
};

export function Badge({ className, variant = 'surface', ...props }) {
  return (
    <span
      className={cn('inline-flex items-center gap-2 rounded-pill px-3 py-1 text-xs font-bold', variants[variant], className)}
      {...props}
    />
  );
}
