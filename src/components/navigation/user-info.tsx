import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarUserType } from "@/data/navigation-scheme";
import { cn } from "@/lib/utils";

const UserInfo = ({user, className}:{user:SidebarUserType; className?: string}) => {
    const renderComponent = () => {
        return (
            <div className={cn("flex items-center", className)}>
                <Avatar className="h-8 w-8 rounded-lg">
                    {user.avatar === '' ? <AvatarImage alt={user.name} className="h-8 w-8 bg-foreground/10" /> : <AvatarImage src={user.avatar} alt={user.name} className="h-8 w-8"/>}
                    <AvatarFallback className="rounded-lg bg-background/10">☕</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                </div>
            </div>
        );
    };
  
    return (<>{renderComponent()}</>);
}

export default UserInfo;