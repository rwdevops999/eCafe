'use client'

import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [inputType, setInputType] = useState<string>("password");

    const handleClick = () => {
      if  (inputType === "password") {
        setInputType("text");
      } else {
        setInputType("password");
      }
    };

    return (
      <div className={cn("relative", className)}>
      <input
        type={inputType}
        className={cn(
          "p-[1rem] pr-[3rem] w-[300px] h-9 rounded-md border border-input bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
        <span className="absolute top-[10px] -ml-8 pr-[1rem]">
          {inputType === "password" && <Eye className="text-[#9CA3AF] w-[1rem] h-[1rem]" onClick={handleClick}/>}
          {inputType === "text" && <EyeOff className="text-[#9CA3AF] w-[1rem] h-[1rem]" onClick={handleClick}/>}
        </span>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
