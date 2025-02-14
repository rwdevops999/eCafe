'use client'

import { Bell } from "lucide-react";
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";
import ProgressLink from "../ecafe/progress-link";

const Notification = () => {
    const router = useRouter();
    
    const showNotifications = () => {
        router.push("/notifications");
    };

    return (
        <ProgressLink href="/notifications" className="flex items-center">
            <Bell size={18} className="mr-2"/>
            Notification
        </ProgressLink>
        // <div className="-ml-4 flex items-center">
        //     <Button variant="ghost" onClick={showNotifications} className="h-4 ml-1">
        //         <Bell size={18} className="mr-2"/>
        //         Notifications
        //     </Button>
        // </div>
  )
}

export default Notification