import { cn } from "@/lib/utils"

function NavHeader({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) {
    return (
      <section
        className={cn(
          "flex flex-col items-start gap-2 border-b border-border/40 py-8 dark:border-border",
          className
        )}
        {...props}
      >
        <div className="container">{children}</div>
      </section>
    )
}

function NavHeaderHeading({
    className,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <h1
        className={cn(
          "ml-2 -mt-5 text-2xl font-bold leading-tight tracking-tighter",
          className
        )}
        {...props}
      />
    )
}
  
function NavHeaderDescription({
    className,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
      <p
        className={cn(
          "ml-2 max-w-2xl text-balance text-lg font-light text-foreground",
          className
        )}
        {...props}
      />
    )
}
  
function NavHeaderActions({
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) {
    return (
      <div
        className={cn(
          "ml-2 flex w-full items-center justify-start gap-2 py-2",
          className
        )}
        {...props}
      />
    )
  }
  
export { NavHeader, NavHeaderHeading, NavHeaderDescription, NavHeaderActions }

  