import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarUserType } from "@/data/navigation-scheme";

const UserInfo = ({user}:{user:SidebarUserType}) => {
    const renderComponent = () => {
        return (
            <>
                <Avatar className="h-8 w-8 rounded-lg">
                    {user.avatar === '' ? <AvatarImage alt={user.name} className="h-8 w-8"/> : <AvatarImage src={user.avatar} alt={user.name} className="h-8 w-8"/>}
                    <AvatarFallback className="rounded-lg bg-background/10">☕</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                </div>
            </>
        );
    };
  
    return (<>{renderComponent()}</>);
}

export default UserInfo;