import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";

const TooltipMessage = ({label, message, className}:{label: string; message: string, className: string}) => {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
              <Label className={cn("underline text-orange-500", className)}>{label}</Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    )
}

export default TooltipMessage