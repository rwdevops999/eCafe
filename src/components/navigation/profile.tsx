'use client'

import { Briefcase } from "lucide-react";
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";
import ProgressLink from "../ecafe/progress-link";
import { useSidebar } from "../ui/sidebar";

const Profile = () => {
    const router = useRouter();

    const showProfile = () => {
        router.push("/profile");
    };

    return (
        <ProgressLink href="/profile" className="flex items-center">
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