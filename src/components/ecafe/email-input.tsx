'use client'

import { cn } from "@/lib/utils"
import { AtSign } from "lucide-react";
import { forwardRef } from "react";

const EmailInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
      <input
        type={type}
        className={cn(
          "p-[1rem] pr-[3rem] w-[300px] h-9 rounded-md border border-input bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
        <span className="absolute top-[10px] -ml-[34px] pr-[1rem]">
          <AtSign className="text-[#9CA3AF] w-[1rem] h-[1rem]" />
        </span>
      </div>
    )
  }
)
EmailInput.displayName = "EmailInput"

export { EmailInput }
