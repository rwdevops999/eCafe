import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard } from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils"
import { AddressType, UserType } from "@/types/ecafe";
import { HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { CalendarDays, Info, ShieldX } from "lucide-react";

const DbcUserProfile = ({className=""}:{className?:string}) => {
  const {user} = useUser();

  const IsEmpty = (user: UserType|undefined, value: string | undefined): boolean => {
    return (! (value || value === ''));
  }

  const hasAddressInfo = (user: UserType|undefined): boolean => {
    let result:boolean = false;

    if (user && user.address) {
      result = result || (user.address.street !== "");
      result = result || (user.address.number !== "");
      result = result || (user.address.box !== "");
      result = result || (user.address.city !== "");
      result = result || (user.address.postalcode !== "");
      result = result || (user.address.county !== "");
    }
    
    return result;
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDateInfo = (date: Date|undefined): string => {
    if (date) {
      return "Joined " + months[date.getMonth()] + " " + date.getFullYear();
    }

    return "unknown";
  }

  const showAddressInfo = (address: AddressType) => {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Info width={16} height={16} className="text-blue-400" />
        </HoverCardTrigger>
        <HoverCardContent side="right" className="w-60 bg-background border border-foreground">

        <div className="flex justify-center space-x-4">
            <div className="text-sm">
              <p>{address.street} {address.number}/{address.box}</p>
              <p>{address.postalcode} {address.city}</p>
              <p>{address.country.name}</p>
              <div className="flex items-center pt-2 mb-1">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  {getDateInfo(user?.createDate)}
                </span>
              </div>
            </div>
        </div>

        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <>
      <div className={cn("", className)}>
        <div>
          <div className="flex space-x-1 justify-center items-center text-md font-bold text-foreground/50">
            <Label>User Profile</Label>
            {user?.blocked ? <ShieldX width={16} height={16} className="text-red-500 animate-pulse"/> : null}
          </div>
          <div className="flex space-x-1 items-center">
            <Label className="mx-1 text-foreground/70">{user?.name}</Label>
            <Label className="text-foreground/70">{user?.firstname}</Label>
            {hasAddressInfo(user) && showAddressInfo(user.address)}
          </div>
          <div>
            <div>
              <Label className="mx-1 font-bold">{user?.email}</Label>
            </div>
            {! IsEmpty(user, user?.phone) ? <Label className="mx-1 font-bold">{`(${user?.address?.country.dialCode}) ${user?.phone}`}</Label> : null}
          </div>
        </div>
      </div>
    </>    
  )
}

export default DbcUserProfile;