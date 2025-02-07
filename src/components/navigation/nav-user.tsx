import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Bell, Briefcase, ChevronsUpDown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SidebarUserType } from "@/data/navigation-scheme";
import UserInfo from "./user-info";

const NavUser = ({user}:{user:SidebarUserType}) => {
  const {t} = useTranslation();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
      setIsClient(true);
    });

  const handleLogout = () => {
    console.log('logged out');
  }

  const renderComponent = () => {
    return (
      <SidebarMenu className="-ml-2">
        <SidebarMenuItem>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserInfo user={user} />
                <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
              className="ml-4 w-[120%] border-2 rounded-lg"
              side="right"
              align="end"
              sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="ml-1 flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="mb-1">
                    <div className="ml-1 flex items-center cursor-pointer space-x-2">
                      <Briefcase size={18}/>
                      <a href="/user/profile" className="capitalize">{isClient ? t('profile') : 'profile'}</a>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="mb-1">
                    <div className="ml-1 flex space-x-2 items-center cursor-pointer">
                      <Bell size={18}/>
                      <a href="/user/notifications" className="capitalize">{isClient ? t('notifications') : 'notifications'}</a>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <div className="ml-1 flex space-x-2 items-center cursor-pointer">
                    <LogOut size={18}/>
                    <div className="capitalize">{isClient ? t('logout') : 'logout'}</div>
                  </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  };

  return (<>{renderComponent()}</>);
}

export default NavUser;