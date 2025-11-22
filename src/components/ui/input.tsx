import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-base px-3 py-2 text-(--text-primary) rounded-md border-0 w-full outline-none shadow-[0_0_0_1px_rgba(0,0,0,0.25)] focus:border-2 focus:border-(--primary-blue)",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input as FieldInput }
