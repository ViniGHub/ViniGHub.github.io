// Adapted from Skiper UI, component "skiper40" (CssLink): https://skiper-ui.com
// Free version, used with attribution. Changes: a plain <a>, no arrow icon, and the underline also
// draws on keyboard focus.
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** Link whose underline draws itself from the left on hover, like a pen stroke. */
export function InkLink({ className, children, ...props }: ComponentProps<'a'>) {
  return (
    <a
      className={cn(
        'relative inline outline-none',
        "before:pointer-events-none before:absolute before:-bottom-1 before:left-0 before:h-px before:w-full before:bg-current before:content-['']",
        'before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]',
        'hover:before:origin-left hover:before:scale-x-100 focus-visible:before:origin-left focus-visible:before:scale-x-100',
        'motion-reduce:before:transition-none',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
