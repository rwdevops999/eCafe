import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Bell, Briefcase, ChevronsUpDown, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SidebarUserType } from "@/data/navigation-scheme";
import UserInfo from "./user-info";
import Link from "next/link";
import Profile from "./profile";
import Notification from "./notification";
import LoginLogout from "./login-logout";

const NavUser = ({user}:{user:SidebarUserType}) => {
  const {t} = useTranslation();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
      setIsClient(true);
    });

  const handleLogin = () => {
  }

  const renderComponent = () => {
      return (
        <SidebarMenu id="ecafe_sidebar" className="-ml-2">
        <SidebarMenuItem>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserInfo user={user} />
                  <ChevronsUpDown className="ml-auto size-4"/>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
              className="ml-4 w-[120%] border-2 rounded-lg"
              side="right"
              align="end"
              sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm bg-foreground/10">
                    <UserInfo user={user} className="-ml-2"/>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="mb-1">
                    <div className="flex items-center cursor-pointer space-x-2">
                      <Profile className="-ml-1"/>
                      {/* <Briefcase size={18}/>
                      <Link href="/profile" className="capitalize">{isClient ? t('profile') : 'profile'}</Link> */}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="mb-1">
                    <div className="flex space-x-2 items-center cursor-pointer">
                      <Notification className="-ml-1"/>
                      {/* <Bell size={18}/>
                      <Link href="/user/notifications" className="capitalize">{isClient ? t('notifications') : 'notifications'}</Link> */}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogin}>
                  <div className="flex space-x-2 items-center cursor-pointer">
                    <LoginLogout className="-ml-1"/>
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