import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarUserType } from "../data/scheme";

const UserInfo = ({user}:{user:SidebarUserType}) => {
    const renderComponent = () => {
        return (
            <>
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} className="h-9 w-9"/>
                    <AvatarFallback className="rounded-lg">☕</AvatarFallback>
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