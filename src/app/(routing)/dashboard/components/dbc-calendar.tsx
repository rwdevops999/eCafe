import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const DbcCalendar = ({className = "", classNames = {day_today: "bg-foreground"}}:{className?:string, classNames?: any}) => {
  return (
    <Calendar
      mode="single"
      selected={new Date()}
      className={cn("rounded-md border", className)}
      classNames={classNames}
    />
  )
}

export default DbcCalendar;