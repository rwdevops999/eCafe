'use client'

import { Briefcase } from "lucide-react";
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";
import ProgressLink from "../ecafe/progress-link";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";

const Profile = ({className}:{className?: string}) => {
    const router = useRouter();

    const showProfile = () => {
        router.push("/profile");
    };

    return (
        <ProgressLink href="/profile" className={cn("flex items-center", className)}>
            <Briefcase size={18} className="mr-2"/>
            Profile
        </ProgressLink>
        // <div className="-ml-4 flex items-center">
        //     <Button variant="ghost" onClick={showProfile} className="h-4 ml-1">
        //         <Briefcase size={18} className="mr-2"/>
        //         Profile
        //     </Button>
        // </div>
  )
}

export default Profile