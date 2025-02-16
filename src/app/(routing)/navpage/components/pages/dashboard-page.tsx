import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

function DashboardPage ({
    className,
    children,
    ...props
  }: HTMLAttributes<HTMLDivElement>) {
    return (
      <section
        className={cn(
          "-ml-2 mt-2 absolute w-[99%] h-[100%] rounded-lg border bg-background shadow-inner shadow-slate-400/30",
          className
        )}
        {...props}
      >
        <div className="container">{children}</div>
      </section>
    )
}

export default DashboardPage;
