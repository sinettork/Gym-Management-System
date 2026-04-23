import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-on-surface shadow-sm transition-all placeholder:text-zinc-400 focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/50',
        className,
      )}
      {...props}
    />
  );
}
