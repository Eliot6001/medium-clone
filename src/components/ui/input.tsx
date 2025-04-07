import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styling: height, full width, rounded, border, padding, text size.
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-all duration-150",
          // Default background & text colors for light/dark mode matching your usage.
          "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200",
          // Remove default outline and ring styles.
          "outline-0 ring-0",
          // Fallback border color.
          "border-gray-300 dark:border-gray-700",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
