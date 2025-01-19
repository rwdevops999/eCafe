'use client'

import { cn } from "@/lib/utils"
import { AtSign } from "lucide-react";
import { forwardRef } from "react";

const EmailInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative">
        <input className="p-[1rem] pr-[3rem] w-[300px] h-9 rounded-md border border-input bg-transparent text-base shadow-sm" placeholder="email..." type="email" />
        <span className="absolute top-[10px] -ml-[34px] pr-[1rem]">
          <AtSign className="text-[#9CA3AF] w-[1rem] h-[1rem]" />
        </span>
      </div>
    )
  }
)
EmailInput.displayName = "EmailInput"

export { EmailInput }
