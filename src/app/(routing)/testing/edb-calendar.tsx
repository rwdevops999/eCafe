import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const EdbCalendar = ({className = "", classNames = {}}:{className?:string, classNames?: any}) => {
  return (
    <Calendar
      mode="single"
      selected={new Date()}
      className={cn("rounded-md border", className)}
      classNames={classNames}
    />
  )
}

export default EdbCalendar;