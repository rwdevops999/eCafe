import { cn } from "@/lib/utils";

const PageTitle = ({title, className}:{title: string; className?: string}) => {
  return (
    <div className={cn("text-red-500 font-bold", className)}>
        {title}
  </div>
)
}

export default PageTitle;