import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'

// shadcn/ui Button, with variants redrawn for this site: square corners, mono label, one accent.
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-mono text-[13px] transition-colors duration-300 outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        accent: 'border border-accent bg-accent text-bg hover:bg-transparent hover:text-accent',
        outline: 'border border-line-strong text-text hover:border-accent hover:text-accent',
        ghost: 'text-muted hover:text-text',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3',
      },
    },
    defaultVariants: { variant: 'outline', size: 'default' },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
