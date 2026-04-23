import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-pill text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-primary-container text-on-primary-fixed shadow-sm hover:-translate-y-0.5',
        inverse: 'bg-inverse-surface text-inverse-on-surface shadow-sm hover:-translate-y-0.5',
        surface: 'bg-surface text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
        ghost: 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
        danger: 'bg-error-container text-error hover:-translate-y-0.5',
        destructive: 'bg-error text-on-error hover:-translate-y-0.5',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-4 text-xs',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
