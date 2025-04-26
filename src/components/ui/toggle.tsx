"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 data-[state=on]:bg-zinc-300 data-[state=on]:text-gray-900 dark:data-[state=on]:bg-zinc-700 dark:data-[state=on]:text-gray-100",
        outline: 
          "border border-zinc-300 dark:border-zinc-700 bg-transparent hover:bg-zinc-100 hover:text-gray-800 dark:hover:bg-zinc-800 dark:hover:text-gray-200 data-[state=on]:bg-zinc-300 data-[state=on]:text-gray-900 dark:data-[state=on]:bg-zinc-700 dark:data-[state=on]:text-gray-100",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }