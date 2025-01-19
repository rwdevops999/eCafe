import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * Application button (orange background) with a caption and (optional)url/handler
 * 
 * @param caption: the caption for the button
 * @param url: an optional url to redirect to
 * @param handler: an optional callback handler
 */
const EcafeButton = (
    {
        id = "button",
        caption,
        url,
        enabled = true,
        className = "bg-orange-400 hover:bg-orange-600",
        clickHandler,
        clickValue = false,
        type = "button"
    }:
    {
        id?: string;
        caption:string; 
        url?: string; 
        enabled?: boolean; 
        className?: string;
        clickHandler?(value: boolean): void;
        clickValue?: boolean,
        type?: "submit" | "reset" | "button"
    }) => {
  return (
        <div>
            {!(url || clickHandler) &&  <Button type={type} id={id} size="sm" className={cn("bg-orange-400 hover:bg-orange-600", className)} variant="default" disabled={! enabled}>{caption}</Button>}
            {url && 
                <Link href={url!}>
                    <Button id={id} type={type} size="sm" className={cn("bg-orange-400 hover:bg-orange-600", className)} variant="default" disabled={! enabled}>{caption}</Button>
                </Link>
            }    
            {!url && clickHandler && 
                <Button type={type} id={id} size="sm" className={cn("bg-orange-400 hover:bg-orange-600", className)} variant="default" onClick={() => clickHandler(clickValue)} disabled={! enabled}>{caption}</Button>
            }
        </div>
    )
}

export default EcafeButton;