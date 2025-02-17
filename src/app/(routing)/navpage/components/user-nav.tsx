'use client'

import LoginLogout from "@/components/navigation/login-logout"
import UserInfo from "@/components/navigation/user-info"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarUserType } from "@/data/navigation-scheme"
import { useUser } from "@/hooks/use-user"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Bell, Briefcase } from "lucide-react"
import UserProfile from "./user-profile"
import UserNotifications from "./user-notification"
import Profile from "@/components/navigation/profile"
import Notification from "@/components/navigation/notification"

const UserNav = () => {
  const {user} = useUser();

  let navuser: SidebarUserType = {
      name: 'ecafé',
      email: user ? user.email : '',
      avatar: user ? `https://ui-avatars.com/api/?name=${user.firstname} ${user.name}&size=24&background=00FF00&color=FF0000&rounded=true` : ''
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/ecafe.png" alt="@shadcn" />
            <AvatarFallback>☕</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end" forceMount>
        <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm bg-foreground/10">
            <UserInfo user={navuser} className="-ml-2"/>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex">
            <Profile className="-ml-1"/>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex">
            <Notification className="-ml-1"/>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LoginLogout className="-ml-1"/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserNav